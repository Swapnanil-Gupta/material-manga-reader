function If({ condition, children }) {
  if (!condition) {
    return null;
  }
  return <>{children}</>;
}

export default If;
