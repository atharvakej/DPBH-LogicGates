function toggle() {
    var circleLoaders = document.querySelectorAll('.circle-loader');
    var checkmarks = document.querySelectorAll('.checkmark');

    // Function to toggle load-complete class with delay
    function toggleCircleLoaderWithDelay(index) {
        setTimeout(function() {
            var circleLoader = circleLoaders[index];
            if (circleLoader.classList.contains('load-complete')) {
                circleLoader.classList.remove('load-complete');
            } else {
                circleLoader.classList.add('load-complete');
            }

            // Display the checkmark
            checkmarks[index].style.display = 'block';

            // If there are more loaders, proceed to the next one
            if (index < circleLoaders.length - 1) {
                toggleCircleLoaderWithDelay(index + 1);
            }
        }, 1000 * index); // Delay increases with each index
    }

    // Start toggling with delay for each circle loader
    toggleCircleLoaderWithDelay(0);
}


// Attach the event listener on Content Loaded.
document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box)=>{
        box.addEventListener('mouseenter' , function(){
            box.querySelector('.response_box').style.display = 'block';
        })
        box.addEventListener('mouseleave' , function(){
            box.querySelector('.response_box').style.display = 'none';
        })
    })
    setTimeout( function(){
        toggle();
    }, 15000)
});


function sendToBackend(body, ss, URL) {
    if (body && ss && URL) {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const bodyRequest = axios.post('http://localhost:8080/extension/body', {
            bodyText: body,
        }, axiosConfig);

        const ssRequest = axios.post('http://localhost:8080/extension/ss', {
            screenshot: ss
        }, axiosConfig);

        const urlssRequest = axios.post('http://localhost:8080/extension/url',{
            screenshot:ss,
            URL:URL
        })

        Promise.all([bodyRequest, ssRequest , urlssRequest])
            .then(function (responses) {
                setResponses(responses);
                console.log('API Calls Successful');
                console.log('Response from body API:', responses[0].data);
                console.log('Response from ss API:', responses[1].data);
                console.log('Response from urlss API:', responses[2].data);
            })
            .catch(function (errors) {
                console.error('API Calls Failed', errors);
            });
    }
}

function setResponses(responses){
    document.getElementById('response1').innerHTML = responses[1].data;
    document.getElementById('response4').innerHTML = responses[0].data;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    
    const body_text = message.lines;
    const screenshotUrl = message.page;
    const pageURL = message.pageURL;

    console.log('message lines',body_text);
    console.log('message page', screenshotUrl);
    console.log('message url', pageURL);

    if (message.lines && message.page && message.pageURL) {
        sendToBackend(body_text , screenshotUrl , pageURL)
    } else {
        console.error('No Text Extracted.')
    }
});


