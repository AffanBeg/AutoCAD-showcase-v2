import sys
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python convert_to_stl.py <input> <output>")
        sys.exit(1)
    inp, outp = sys.argv[1], sys.argv[2]
    print(f"[demo] Would convert {inp} -> {outp} with FreeCAD CLI")
