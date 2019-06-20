
// This file holds utility functions to do simple but relatively frequent 
// and finicky actions in vanilla js so we don't need jQuery.

//This function will grab an element by its class, 
// but only the last one in the array of elements by class. 
// Most useful when using unique classes instead of ids.
export const elemByClass = (selectedClass) => {
    let result;
    selectedClass.forEach(element => {
        result = element
    });
    return result;
};
// ----------------

// This function takes a querySelectorAll node array and runs 
// them through a function also passed inside the arguments.
export const funcOnClass = (querySeleced, func) => {
    querySeleced.forEach(element => {
        func(element)
    });
}
// ----------------

// This function will add a function as a click event to a 
// querySelectorAll node array of classes.
export const clickClass = (querySeleced, func) => {
    if (typeof querySeleced === 'object' && querySeleced !== null){
        if(querySeleced.length >= 1){
            querySeleced.forEach(element => {
                element.addEventListener('click', func)
            });
        } else if (objectLength(querySeleced) === 0) {
            querySeleced.addEventListener('click', func)
        } else if (querySeleced === null) {
            say ("The element is null.");
        } else if (querySeleced === undefined) {
            say ("The element is undefined.");
        } else {
            say ("Something is wrong here!")
        };
    };
};
// ----------------

// This function to check if an element has a particular class.
export const hasClass = (el, className) => {
    if (el.classList)
        return el.classList.contains(className)
    else
        return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`))
}
// ----------------

// This function will add a class to a given element.
export const addClass = (el, className) => {
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className)) el.className += ' ' + className
}
// ----------------

// This function will remove a class from an element.
export const removeClass = (el, className) => {
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className)) {
        const reg = new RegExp(`(\\s|^)${className}(\\s|$)`)
        el.className = el.className.replace(reg, ' ')
    }
}

//This function currently acts as a faster way to write console.log() 
// while also getting back the type of the logged variable.
export const q = (check) => {
    console.log(`Q: This ${typeof check} has a value of:`);
    console.log(check)
}

// This function is a faster way of console.logging a string 
// - a better way of sending a simple message to the console.
export const say = (log) => {
    console.log(`Message: ${log}`);
}

// This function returns a number equal to the number of keys in an Object.
export const objectLength = (object) => {
    return Object.keys(object).length;
}

