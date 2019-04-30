
let
  type Circle = {
    x: int,
    y: int,
    color: string
  }
  type list = array of string
  var c: Circle := Circle {y = 2, x = 5<3&2<>1, color = "blue"}
  var dogs: list := list [3] of "woof"
  function successor(x: int) = x + 1
in
  dogs[1] := "Sparky";
  for i := 1 to 10 do
    print(concat(chr(2), "xyz"))
    /*
     *
     * NEEDS A ZILLION MORE THINGS
     *
     */
end

