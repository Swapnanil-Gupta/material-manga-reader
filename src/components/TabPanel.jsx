import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  if (value !== index) {
    return null;
  }

  return (
    <div {...other}>
      <Box py={3}>{value === index && <>{children}</>}</Box>
    </div>
  );
}

export default TabPanel;
