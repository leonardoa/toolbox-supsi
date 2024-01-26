// OpenAI API key for authentication
const API_KEY = "myAPIkey";
const submitIcon = document.querySelector("#submit-icon");
const inputElement = document.querySelector("#input");
const imageSection = document.querySelector(".images-section");

// function to fetch images from OpenAI API
const getImages = async() => {
  // display "Loading..." while fetching images
  submitIcon.innerHTML = "Loading ..."

// request options for the API call
  const options = {
    method: "POST",
    headers: {
      "Authorization":`Bearer ${API_KEY}`,
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
       prompt: inputElement.value, 
       n: 1,
      //  size: "1024x1024"
      size: "256x256"
    })
  }

  try{
    // fetch images from the OpenAI API
    const response = await fetch("https://api.openai.com/v1/images/generations", options);
    const data = await response.json();
    console.log(data);

    // display each generated image in the image section
      data?.data.forEach(image => {
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');

      const imageElement = document.createElement('img');
      imageElement.setAttribute('src', image.url);
      imageContainer.append(imageElement); 

      imageSection.append(imageContainer);
      submitIcon.innerHTML = "Generate image"
    })

  } catch (error){
    console.error(error); // or put console.log(error)
  }
}

// event listener for the click event on the submit button
submitIcon.addEventListener('click', getImages);
