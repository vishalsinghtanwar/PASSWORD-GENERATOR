const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const Sysmbols = '!@~`#$%^&*()_+={}][;:/?.>,<-+*/0';

let password ="";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){ 
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordlength - min) * 100 / (max - min) ) + "% 100%";
}
 
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getRandInteger(min, max){
    return Math.floor(Math.random() * (max - min )) + min;
}
 
function getRandomLowercase(){
    return String.fromCharCode(getRandInteger(97,123));
}

function getRandomUppercase(){
    return String.fromCharCode(getRandInteger(65,91));
}
function getRandomSymbol(){
    const randNum = getRandInteger(0, Sysmbols.length);
    return Sysmbols.charAt(randNum);
}
function getRandnumber(){
    return getRandInteger(0,9);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00")
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    },2000);
}

function Shufflepassword(Array){
    for (let i = Array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i +1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    } 
    let str = "";
    Array.forEach((el) => (str += el));
    return str;
}
 
function handleChekBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    });

    if(passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleChekBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyContent();
    }
})


generateBtn.addEventListener('click', () => {

    if(checkCount == 0)
    return;

    if(passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
       funcArr.push(getRandomUppercase);
    
       if(lowercaseCheck.checked)
       funcArr.push(getRandomLowercase);
    
       if(numbersCheck.checked)
       funcArr.push(getRandnumber);
    
       if(symbolsCheck.checked)
       funcArr.push(getRandomUppercase);

    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
     // console.log("compalsary addition done")
    for(let i = 0; i < passwordlength-funcArr.length; i++){
        let randIndex = getRandInteger(0 , funcArr.length);
        // console.log("randIndex"+ randIndex);
        password += funcArr[randIndex]();
    }
    // console.log("passsword addition done")
    password = Shufflepassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
});
