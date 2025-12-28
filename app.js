//chrome://extensions/
const inputElement = document.getElementById("input-ele");
const save = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const list1 = document.getElementById("list");
const saveTab = document.getElementById("tab");
const errorMsg = document.getElementById("error-msg");
const warning = document.getElementById("warn-msg");
var arr = [];
const parsedData = JSON.parse(localStorage.getItem("extension11"))

if(parsedData)
{   
    arr = parsedData;
    renderElements(arr);
}

// Error and warning Handling
function showError(message) 
{
    errorMsg.textContent = message;
    errorMsg.classList.remove("hidden");
}

function showWarning(message) 
{
    warning.textContent = message;
    warning.classList.remove("hidden");
}

function hideError() 
{
    errorMsg.classList.add("hidden");
}

// End of Error Handling


/* --------------- Normalising URL -------------------- */
function normalizeURL(url) 
{
    if (!/^https?:\/\//i.test(url)) {
        return "https://" + url;
    }
    return url;
}

function isValidURL(url) 
{
    try {
        const parsed = new URL(url);

        // Must be http or https
        if (!["http:", "https:"].includes(parsed.protocol)) {
            return false;
        }

        // Must contain a dot (.) in hostname
        if (!parsed.hostname.includes(".")) {
            return false;
        }

        // No spaces allowed
        if (url.includes(" ")) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}


function renderElements(data)
{
    let listItems ="";
    for(let i = 0 ; i < data.length ; i++)
    {
        const url = normalizeURL(data[i]);
        if(isValidURL(url))
            listItems += `
                <li>
                    <a href="${url}" target="_blank" rel="noopener noreferrer">
                    ${url}
                    </a>
                </li>`;
        else
            showError("The URL is not valid!");
    }
        
    list1.innerHTML = listItems;
}

saveTab.addEventListener("click", function() {
    //Grabbing the URL of the current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        arr.push(tabs[0].url);
        localStorage.setItem("extension11", JSON.stringify( arr ))
        renderElements(arr);
    });
})

deleteButton.addEventListener("click", function() {
    localStorage.clear();
    arr = [];
    renderElements(arr);
});


save.addEventListener("click", function() 
{
    let url = inputElement.value.trim();
    hideError();

    if(!url)
    {
        showError("URL cannot be empty!");
        return;
    }

    url = normalizeURL(url);

    if(!isValidURL(url)) 
    {
        showError("Please enter a valid URL.");
        return;
    }

    if (arr.includes(url)) {
        showWarning("This URL is already saved!");
        return;
    }

    arr.push(inputElement.value)
    localStorage.setItem("extension11", JSON.stringify(arr));
    renderElements(arr);
    inputElement.value = '';
})


/*
var loadData = () => 
        {
            try
            {
                const dataExtension = localStorage.getItem("extension11");
                if(dataExtension)
                {
                    const parsedData = JSON.parse(dataExtension)
                    if(parsedData && Array.isArray(parsedData))
                    {
                        arr == parsedData;
                        renderELements();
                    }
                }
            }

            catch (error) 
            {
                    console.error("Error loading card data:", error);
            }

        }
*/





