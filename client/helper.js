const handleError = (message) => {
    console.log(message)
  };
  

const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
  
    if(result.redirect) {
      window.location = result.redirect;
    }
  
    if(result.error) {
      handleError(result.error);
    }

    if(handler) {
        handler(result);
    }
  };

  const hideError = () => {
    document.getElementById('errorM').classList.add('hidden');
  };

  module.exports = {
    handleError,
    sendPost,
    hideError,
  };