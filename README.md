# FLOWSIM README File

FLOWSIM is a software package that simulates a [compartmental model](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology) for epidemiology.

## Content

The library consists of three parts :

* [`flowsim.models`](models/README.md) contains the core simulation software, consisting of a discrete time transition engine allowing to represent and simulate compartmental models. 
* [`flowsim.labs`](labs/README.md) contains a series of experimental data analytic tools (prediction, machine learning, parameter estimation ...) allowing to confront field observations with an established model.
* `flowsim.app` is a web server that allows to visually represent the behaviour of an implemented model and to interactively ajust some of its parameters.

## Copyright

FLOWSIM is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

FLOWSIM is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
    along with FLOWSIM.  If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).
