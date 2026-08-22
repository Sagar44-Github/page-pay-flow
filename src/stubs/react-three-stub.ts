export class Canvas {
  static displayName = "CanvasStub";
  render() {
    return null;
  }
}

export function useFrame() {}
export function useThree() {
  return { camera: {}, scene: {}, gl: {} };
}

export function Float(props: { children?: unknown }) {
  return props.children ?? null;
}

export function MeshDistortMaterial() {
  return null;
}

export function OrbitControls() {
  return null;
}

export function Stars() {
  return null;
}

export default {};
