import sys
import os

def convert_to_stl(input_path: str, output_path: str):
    """Convert STEP/OBJ to STL using FreeCAD"""
    try:
        import FreeCAD
        import Mesh
        import Import

        print(f"[convert] converting {input_path} to {output_path}")

        # Determine file type
        ext = input_path.lower().split('.')[-1]

        if ext in ['step', 'stp']:
            # Import STEP file using Part module
            import Part
            doc = FreeCAD.newDocument("temp")

            # Try using Part.read() first (more direct method)
            try:
                shape = Part.read(input_path)
                print(f"[convert] imported shape with Part.read()")
            except Exception as e:
                print(f"[convert] Part.read() failed: {e}, trying Import.insert()")
                # Fallback to Import.insert()
                Import.insert(input_path, "temp")
                objs = [obj for obj in doc.Objects if hasattr(obj, 'Shape')]
                if not objs:
                    raise Exception(f"No shapes found in STEP file. Document has {len(doc.Objects)} objects")
                shapes = [obj.Shape for obj in objs]
                shape = shapes[0] if len(shapes) == 1 else shapes[0].multiFuse(shapes[1:])

            # Convert shape to mesh and export
            print(f"[convert] converting shape to mesh...")
            mesh = Mesh.Mesh()
            mesh.addFacets(shape.tessellate(0.01))
            mesh.write(output_path)

        elif ext == 'obj':
            # Import OBJ and convert to STL
            doc = FreeCAD.newDocument("temp")
            Mesh.insert(input_path, "temp")
            Mesh.export(doc.Objects, output_path)

        elif ext == 'stl':
            # Already STL, just copy
            import shutil
            shutil.copy(input_path, output_path)

        else:
            raise Exception(f"Unsupported file type: {ext}")

        # Verify output exists
        if not os.path.exists(output_path):
            raise Exception("Conversion failed: output file not created")

        print(f"[convert] conversion successful: {output_path}")

    except Exception as e:
        raise Exception(f"FreeCAD conversion failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_to_stl.py <input_path> <output_path>")
        sys.exit(1)

    convert_to_stl(sys.argv[1], sys.argv[2])
