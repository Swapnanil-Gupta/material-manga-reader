import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      py={3}
      role="tabpanel"
      hidden={value !== index}
      id={`manga-details-tabpanel-${index}`}
      aria-labelledby={`manga-details-tab-${index}`}
      {...other}
    >
      {children}
    </Box>
  );
}

export default TabPanel;
