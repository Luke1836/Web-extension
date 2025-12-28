//chrome://extensions/
const inputElement = document.getElementById("input-ele");
const save = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const list1 = document.getElementById("list");
const saveTab = document.getElementById("tab");
var arr = [];
const parsedData = JSON.parse(localStorage.getItem("extension11"))

if(parsedData)
{   
    arr = parsedData;
    renderElements(arr);
}


function renderElements(data)
{
    let listItems ="";
    for(let i = 0 ; i < data.length ; i++)
        listItems += `
            <li>
                <a href= "${data[i]}" target = '_blank'>
                ${data[i]}  
                </a>
            </li>`;
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


save.addEventListener("click", function() {
    arr.push(inputElement.value)
    localStorage.setItem("extension11", JSON.stringify(arr));
    renderElements(arr);
    inputElement.value = '';
    /* 
        const li = document.createElement("li");
        li.textContent = arr[c];
        list1.append(li);
    */
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





