exports.testing_nodecorn = async (req, res) => {
    try {
      console.log("I am being called from the cron job");
      // Your logic here
    } catch (err) {
      console.error(err);
      // Handle errors appropriately
    }
  };