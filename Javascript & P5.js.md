JavaScript is a scripting language that is typically used on web pages where it runs client-side (within the web browser). It is a general purpose language with a lot of built-in functionality for interacting with elements on a webpage and responding to actions initiated by the user.

Although the JavaScript has "Java" in it's name, it isn't related other than by the fact that it looks something like Java. JavaScript's official name is ECMAScript (ECMA is the European Computer Manufacturers Association, a standards body). It was initially created by Netscape Communications. ([Wikipedia: JavaScript](http://en.wikipedia.org/wiki/JavaScript))


# `<script>` tag

JavaScript can be placed anywhere within an HTML document, although it is typically included in the "head" section of the HTML, and is specified by the use of `<script>` tags:

```html
<html>              
  <head>              
    <script type="text/javascript">              
      //JavaScript goes here

    </script>
  </head>              
</html>              
```

You can also write JavaScript in file external to the HTML and point to that file in a script tag.

```html
<script type="text/javascript" src="myscript.js"></script>
```


# Console

One of the first things we probably want to learn is how to get debugging output. You can write to the console by using the built-in console.log method:
```javascript
console.log("hello");
```
In order to see the console on Chrome, select "View" > "Developer" > "JavaScript Console". Use it often!

# Variables

A variable stores a value in memory so that it can be used later in a program. The variable can be used many times within a single program, and the value is easily changed while the program is running.

The primary reason we use variables is to avoid repeating ourselves in the code. If you are typing the same number more than once, consider making it into a variable to make your code more general and easier to update.

## Data Types

JavaScript is a "loosely typed" or "dynamic" language, meaning you don't have to declare the types of variables ahead of time. The type will get determined automatically while the program is being processed. Other languages such as Java are strictly typed and each variable must declare the type of the data it will contain. Even though you don't have to declare types, JavaScript does have different data types.

### Number

A number with a decimal point. In other languages this is typically called a float. It can be written with or without the decimal point, the processor will interpret it as a floating point number.

```javascript
var x = 5;
var y = 1.223;
var z = -300;
```

### String

A series of characters. These can be defined with either single or double quotes.

```javascript
var x = 'hello';
var y = "maybe tomorrow";
```

There are a number of built-in JavaScript properties and methods that let you manipulate strings. You can see them all [here](http://www.w3schools.com/js/js_string_methods.asp), a few of the most common follow.

**length**

Gives the length of the string.

```javascript
var str = "I like to eat pickles."
console.log(str.length); // 22
```

**indexOf(str)**

Returns the index of (the position of) the first occurrence of a specified text in a string. Returns -1 if the search string is not found.

```javascript
var str = "I like to eat apples.";
var pos = str.indexOf("eat");
console.log(pos); // 10
pos = str.indexOf("pears");
console.log(pos); // -1
```

**substring(start, end)**

Extracts a part of a string and returns the extracted part in a new string. The method takes 2 parameters: the starting index, and the ending index.

```javascript
var str = "I like to eat apples.";
var newStr = str.substring(2, 6);
console.log(newStr); // "like"
```

**toLowerCase(), toUpperCase()**

These functions convert the string to all lower or all upper case.

```javascript
var str = "I like to eat apples.";
var lowerStr = str.toLowerCase();
console.log(lowerStr); // "i like to eat apples."
var upperStr = str.toUpperCase();
console.log(upperStr); // "I LIKE TO EAT APPLES."
```

### Boolean

A "true" or "false" value. Boolean variables are often used for conditional testing and keeping track of state.

```javascript
var n = false;
var m = true;
```

### Object

An object can be thought of as a collection of properties. These properties can be values of any type, including other objects, which enables building complex data structures. Arrays are a special type of object, more on this later.
* Read more [about arrays](https://github.com/processing/p5.js/wiki/JavaScript-basics#arrays)
* Read more [about objects](https://github.com/processing/p5.js/wiki/JavaScript-basics#objects)

### Null and undefined

The value of a variable with no value is undefined. Variables can be emptied by setting the value to null.

```javascript
var cars;              // value is undefined
var person = null;     // value is null
```

## Assignment

Once variables are declared, you are free to assign values to them and subsequently use them in operations.

```javascript
var x = 5;
x = 5 + 5;
x = "cat";
var y = 5.5;
y = x;
```

# Operators

### Assignment
* `=`

### Mathematical
* `+` addition
* `-` subtraction
* `*` multiplication
* `/` division
* `%` modulo
* `++` add one shorthand
* `--` subtract one shorthand

### Relational
* `>=` greater than or equal to
* `<=` less than or equal to
* `==` equality
* `!=` inequality
* `===` equality with type checking
* `!==` inequality with type checking

### Logical
* `||` logical OR
* `&&` logical AND
* `!` logical NOT

# Conditionals

Conditionals allow your program to execute a block of code based on the result of an expression that utilizes relational or logical (boolean) operators.

**if**

```javascript
var x = 1;
if (x > 0) {
  // execute some code
}
```

**if, else**

```javascript
var x = 1;
if (x > 0) {
  // execute some code
} else {
  // execute some other code
}
```

**if, else if, else**

```javascript
var x = 1;
if (x > 5) {
  // execute some code
} else if (x < -5) {
  // execute some other code
} else {
  // execute some other other code
}
```

**multiple conditions**
```javascript
var x = 1;
if (x > -5 && x < 5) {
  // execute some code!
}
```

```javascript
var x = "puddings";
if (x.length === 8 || x.indexOf("ding") === -1) {
  // execute some code!
}
```

# Loops

### While

Just as with our conditional (if / else) statements a while loop employs boolean test that must evaluate to true in order for the instructions enclosed in the curly brackets to be executed. The difference is that the instructions continue to be executed until the test condition becomes false.

```javascript
var x = 0;
while (x < 10) {
  console.log(x);
  x++;
}
```

### For

Since this is a common use of a loop (creating a variable, checking it's value and incrementing by a certain amount) there exists an even quicker way to do the above, all in one step. You can read this as, create variable x and set it to 0, while x is less than 10, do the following. Increment x by 1 at the end.

```javascript
for (var x = 0; x < 10; x++) {
  console.log(x);
}
```

# Functions

A function is a block of reusable code. It is useful because you can reuse it, executing it many times. Functions also help structure and organize your code.

To create a function, you write the word `function` followed by the function name, a set of parentheses, and a set of curly braces. Within the curly braces is the code that will be executed when the function is run.

```javascript
function doSomething() {
  // stuff happens here
}
doSomething(); // call the function
```

```javascript
function sayHello() {
  console.log("hello");
}
sayHello(); // call the function
```

```javascript
// with p5.js
function changeBackground() {
  background(random(255), random(255), random(255));
}
```

### Function parameters

A function can also accept values as input, known as arguments or parameters. In this case, the parameters (names representing the values) are listed inside the parentheses of the function, separated by commas. Note that these parameters are not the names of actual variables in your program, but are variables limited to the scope of the function. When a function is run, the values passed in are temporarily assigned to the parameter defined in the function, until the function completes its execution.

```javascript
function sayHello(person) {
  console.log("hello "+person);
}
sayHello("jenny");
```

```javascript
function addNumbers(a, b) {
  var c = a + b;
  console.log(c);
}
addNumbers(3, -10);
```

```javascript
// with p5.js
function drawEllipse(x, y) {
  ellipse(x, y, 50, 50);
}
drawEllipse(mouseX, mouseY);
```

### Returning a value

The functions above take some action or change the state of the program, but they don't return any value. If you want your function return a value, include a line starting with `return` followed by the value to return as the last line in your function.

```javascript
function addNumbers(a, b) {
  var c = a + b;
  return c;
}
var result = addNumbers(3, -10);
console.log(result); // -7
```

```javascript
var name = "jenny";
function makeSuper(person) {
  return "super "+person;
}
var name = makeSuper(name);
console.log(name); // "super jenny"
```

```javascript
// p5.js has some built-in functions like this
var x = random(100);
console.log(x);

// you can write your own using p5.js functions, too
function addJitter(x) {
  var y = x + random(-1, 1); // uses p5.js random fxn within
  return y;
}
var result = addJitter(10);
console.log(result); // 10.3 or 9.8 or...
```


# Variable scope

Variables that you declare inside a function are local to that function. Variables declared outside of any function are known as "global variables" and can be accessed from anywhere in the program.

If I have a function called blah and inside blah I declare a variable called "counter", I can not refer to counter outside of the function. In the case that I want to use the value of counter outside of the function, I either have to declare it outside of the function or return it's value.

```javascript
var xGlobal = "global";

function globalLocalTest() {
  var xLocal = "local";
  console.log("inside function global: " + xGlobal);
  console.log("inside function local: " + xLocal);		
}

globalLocalTest();

console.log("outside function global: " + xGlobal);
console.log("outside function local: " + xLocal);
```

### Warning

Be careful about reinitializing an existing global variable. You will not see any error, but it could end up confusing things.

```javascript
var a = 10;
function doStuff() {
  var a = "cats"; // ok, but don't!
  console.log(a);
}
console.log(a);
```

# Arrays

Arrays are used to store multiple objects or values in one variable. To create an array, use square brackets, and place any number of items separated by commas in between.

```javascript
var arr = []; // empty array
var fruits = ["apple", "dragonfruit", "banana", "starfruit"];
var ages = [10, 21, 89, 3, 68];
var misc = ["pumpkin", 10.4, "dog", false, -1]; // arrays can have items of different datatypes
var more_misc = ["dustpan", "k", fruits, misc]; // arrays can contain other arrays
```

You can place or access items in the array by index, the first item in an array has index 0.

```javascript
var arr = [];
arr[0] = "moss";
arr[1] = "sludge";
arr[2] = "mold";
console.log(arr); // ["moss", "sludge", "mold"]
console.log(arr[1]); // "sludge"
```

You can use a for loop to iterate over an array.

```javascript
var arr = ["mushrooms", "cheerios", "sparkling water"];
for (var i=0; i<3; i++) {
  arr[i] = "I love "+arr[i];
}
console.log(arr); // ["I love mushrooms", "I love cheerios", "I love sparking water"]
```

Like strings, arrays have some built-in convenience properties and methods. You can see them all in the [MDN array reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods), a few of the common ones follow.

**length**

Gives the length (number of items) of the array. This can be useful for iterating over arrays.

```javascript
var arr = [3, 5, 19];
for (var i=0; i<arr.length; i++) {
  arr[i] *= 2;
}
console.log(arr.length); // 3
console.log(arr); // [6, 10, 38]
```

**push()**

Adds (pushes) a new element to the end of the array, increasing the length of the array by 1.

```javascript
var arr = [30, 10, 0];
arr.push(true);
console.log(arr.length); // 4
console.log(arr); // [30, 10, 0, true]
```

**indexOf(elt)**

Returns the index of given element, or returns -1 if it's not found.

```javascript
var array = [2, 5, 9];
var index = array.indexOf(2); // 0
index = array.indexOf(7); // -1
index = array.indexOf(9, 2); // 2
index = array.indexOf(2, -1); // -1
index = array.indexOf(2, -3); // 0
```

# Objects

JavaScript doesn't have a "class" statement like Java or C++, instead it just uses functions as classes. Defining a class is as easy as defining a function.

```javascript
function Cat() {

}
```

The code above creates a constructor function for a Cat object. It is a very simple object with no properties or methods.

## Creating a new instance

To create a new instance of an object using a constructor, you write "new" followed by the name of the class and a set of parentheses.

```javascript
var cat0 = new Cat();
```

If you were to log this object to the console you will notice that it prints an empty set of curly braces.

```javascript
console.log(cat0); // Cat {}
```

 That is really all this object is, and you could have created the same thing by writing:

```javascript
var cat0 = {};
```

However, creating the constructor function is useful when you want to make more than one instance of the object, especially if you have set properties or methods for the object.

```javascript
var cat0 = {};
var cat1 = {};
var cat2 = {};
```

## Adding properties

Properties are variables within the object. They can be set in the constructor by including a line in the form `this.propertyName = propertyValue;`. Within an object constructor function, there is a special variable "this" that always refers to the new instance that is being created. So when the function includes `this.propertyName = propertyValue;` it is saying that all new instances will be automatically assigned the given properties and values upon instantiation.

```javascript
function Cat() {
  this.name = "Margot";
  this.age = 8;
  this.color = "Black";
}
```

If you create and log a Cat object now you will notice that the new instance now has properties, rather than just empty curly braces.

```javascript
var cat0 = new Cat();
console.log(cat0); // Cat {name: "Margot", age: 8, color: "Black"}
}
```

You can access and modify these properties directly by using `.propertyName`.

```javascript
console.log(cat0.name);  // "Margot"
cat0.name = "Sam";       // change name to Sam
console.log(cat0.name);  // "Sam"

cat0.age++;              // increment age by 1
console.log(cat0.age);   // 9

console.log(cat0.color); // "Black"
```

## Adding methods

While properties are like variables within an object, methods are like functions within an object. They are set and accessed in much the same way.

```javascript
function Cat() {
  // set some properties
  this.name = "Margot";
  this.age = 8;
  this.color = "Black";

  // set some methods
  this.greet = function() {
    console.log("Hello, I'm "+this.name);
  }
```

The constructor function above sets some properties of Cat, then it adds one method, "greet". This line looks kind of like a function definition, but is a slightly different format. With a normal function, you may be used to something like this:

```javascript
function doSomething() {
  console.log("I'm doing something!");
}
```

However, it's important to know that the above function could be rewritten like this:

```javascript
var doSomething = function() {
  console.log("I'm doing something!");
};
```

These two definitions are the same, just written differently. In both cases what is happening is that a function is defined and assigned to a variable name of your choosing. Remember in JS, a variable can be anything - a string, a number, a boolean, etc - but also a function.

In the first case, this variable name is stuck after the word function, in the second, the variable is explicitly stated first, then the function is assigned. They mean the same thing, so it's helpful to get used to seeing both forms.

So turning back to the method declaration, it starts to look more familiar. It's very similar to the new function definition format we just saw, but `var functionName = ` is replaced with `this.functionName = `. This is because, just like the properties, we use `this.` to say that the method belongs to the object being created.

```javascript
this.greet = function() {
  console.log("Hello, I'm "+this.name);
}
```

Calling this method of an instance looks similar to accessing properties.

```javascript
var cat0 = new Cat();
cat0.greet(); // "Hello I'm Margot"

cat0.name = "Sam";
cat0.greet(); // "Hello I'm Sam";
```

## Using parameters

You can also pass parameters into the constructor function, the same way parameters are passed into any function. The arguments are listed within the parentheses for the constructor function, separated by commas.

```javascript
function Cat(name, age) {
  this.name = name;
  this.age = age;
  this.color = "Black";

  this.greet = function() {
    console.log("Hello, I'm " + this.name);
  }
}

var cat0 = new Cat("Joanie", 10);
var cat1 = new Cat("Jay", 2);

cat0.greet(); // "Hello, I'm Joanie"
cat1.greet(); // "Hello, I'm Jay"
```

# Code formatting

### Comments

It is a good idea to add comments to your code so you can remember what you're doing and debug when things go wrong. Commenting can also be useful for quickly removing or adding back in chunks of code (safer than deleting the chunk). Comments in JavaScript are similar to comments in Java or C.

```javascript         
  // single line comment   
```
```javascript     
  /*
    multiple
    line
    comment
  */
```

### Indentation

Whenever you introduce curly braces, you should indent everything inside. You can use two spaces or four, but be consistent. This will help you make sense of your code later.

```javascript
function doStuff(x) {
  if (x > 0) {
    console.log("x is greater than 0");
  } else {
    console.log("x is not greater than 0");
  }
}
```

### Semicolons

A code statement generally ends with a semicolon.

```javascript
var x = 10;
```

However, you may hear that semicolons are optional in JavaScript. This is sort of true. You can read more [here](http://www.codecademy.com/blog/78-your-guide-to-semicolons-in-javascript), but my general recommendation is to use semicolons to avoid confusion.
