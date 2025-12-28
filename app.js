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
    arr = parsedData.map(url => normalizeURL(url));
    localStorage.setItem("extension11", JSON.stringify(arr));
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

function hideWarning() 
{
    warning.classList.add("hidden");
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

function isDuplicate(url) {
    return arr.some(storedUrl => storedUrl === url);
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
    }
        
    list1.innerHTML = listItems;
}

saveTab.addEventListener("click", function () {
    hideError();
    hideWarning();

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = normalizeURL(tabs[0].url);

        if (isDuplicate(url)) {
            showWarning("This tab URL is already saved");
            return;
        }

        arr.push(url);
        localStorage.setItem("extension11", JSON.stringify(arr));
        renderElements(arr);
    });
});

deleteButton.addEventListener("click", function() {
    hideError();
    hideWarning();
    localStorage.clear();
    arr = [];
    renderElements(arr);
});


save.addEventListener("click", function() 
{   
    hideError();
    hideWarning();
    let url = inputElement.value.trim();

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

    if (isDuplicate(url)) 
    {
        showWarning("This URL is already saved");
        return;
    }

    arr.push(url)
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





