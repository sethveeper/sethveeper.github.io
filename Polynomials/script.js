function pageOut(output) {
  document.getElementById("output").innerHTML += "<p>";
  document.getElementById("output").innerHTML += output;
  document.getElementById("output").innerHTML += "</p>";
}
// End of pageOutput function

pageOut("Hello, fox. It's been a while~");

/*================================
==  End of Constant declaration ==
================================*/

class Term {
  constructor(inCoeff, inVar, inExp) {
    this.coefficient = inCoeff;
    this.variable = inVar;
    this.exponent = inExp;
  }
  // End of Constructor method

  toString() {
    var output = " ";

    if (this.coefficient >= 0)
      output += "+" + this.coefficient;
    else
      output += this.coefficient;
    // End of plus/minus check

    if (this.exponent == 1)
      output += this.variable;
    else if (this.exponent == 0)
      output = output;
    else
      output += this.variable + "^" + this.exponent;

    return output;
  }
  // End of toString method

  toSolve(x) {
    console.log("Solving " + this.toString() + " where " + this.variable + " = " + x);
    var output = 1;
    for (var i = this.exponent; i > 0; i--) {
      console.log("   " + output + " * " + x + " = " + (output * x));
      output = output * x;
    }
    // End of For loop (Exponent)
    console.log("   " + this.coefficient + " * " + output + " = " + (output * this.coefficient));
    output = output * this.coefficient;

    return output;
  }
  // End of toSolve method
}
// End of Term class

class Polynomial {
  constructor() {
    this.array = [];
  }
  // End of Constructor method

  pushTerm(inCoeff, inVar, inExp) {
    this.array.push(new Term(inCoeff, inVar, inExp));
  }
  // End of addTerm method

  toSimplify() {
    var buckExp = [[0], [1], [2], [3], [4], [5]];
    for (var i = 0; i < this.array.length; i++) {
      console.log("Putting " + this.array[i].toString() + " into buckExp[" + this.array[i].exponent + "]");
      buckExp[this.array[i].exponent].push(this.array[i]);
    }
    // End of For loop (sorting each term by Exponent)

    var outPoly = new Polynomial();
    for (var i = 0; i < buckExp.length; i++) {

      var dump = buckExp[i];
      dump[0] = new Term(0, "x", i)
      for (var t = 1; t < dump.length; t++) {
        console.log("Attempting to combine " + (dump.length - 1) + " like terms...");
        dump[0].coefficient += dump[t].coefficient;
        dump[0].variable = dump[t].variable;
      }
      // End of For loop (Emptying each 'bucket')
      if(dump[0].coefficient != 0)
      {
        console.log("Pushing " + dump[0].toString());
        outPoly.pushTerm(dump[0].coefficient, dump[0].variable, dump[0].exponent);
      }
    }
    // End of For loop (Dumping like exponents back together)

    return outPoly;
  }
  // End of ToSimplify method
  toSolve(x) {
    var output = 0;

    for (var i = 0; i < this.array.length; i++) {
      console.log(output + this.array[i].toString() + " = " + (output + this.array[i].toSolve(x)));
      output += this.array[i].toSolve(x);
    }
    // End of For loop

    return output;
  }
  // End of toSolve method

  toString() {
    var output = "";
    for (var i = 0; i < this.array.length; i++) {
      output += this.array[i].toString();
    }

    return output;
  }
  // End of toString method
}
// End of Polynomial class

/*=========================
== End of Class declaration
=========================*/

myVar = "f";
foxPoly = new Polynomial();
foxPoly.pushTerm(3, myVar, 1);
foxPoly.pushTerm(12, myVar, 2);
foxPoly.pushTerm(22, myVar, 3);
foxPoly.pushTerm(13, myVar, 2);
foxPoly.pushTerm(4, myVar, 4);
foxPoly.pushTerm(-2, myVar, 2);
foxPoly.pushTerm(22, myVar, 3);
foxPoly.pushTerm(-5, myVar, 2);
foxPoly.pushTerm(-52, myVar, 2);
foxPoly.pushTerm(22, myVar, 3);
foxPoly.pushTerm(+30, myVar, 2);
foxPoly.pushTerm(-6, myVar, 2);

pageOut("Before simplification: " + foxPoly.toString() + " = " + foxPoly.toSolve(5));

newPoly = foxPoly.toSimplify();
pageOut("After simplification: " + newPoly.toString() + " = " + newPoly.toSolve(5));
