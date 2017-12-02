// @flow
type Component = {
  displayName?: string,
  name?: string
};

export default function getDisplayName(Component: Component): string {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' && Component.length > 0
      ? Component
      : 'Unknown')
  );
}
