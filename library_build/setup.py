"""
    This file is part of Flow Simulator (FlowSim).

    FlowSim is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    FlowSim is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with FlowSim.  If not, see <https://www.gnu.org/licenses/>.

    Copyright (c) 2020 Bart Lamiroy
    e-mail: Bart.Lamiroy@univ-lorraine.fr
"""

import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="flowsim",
    version="0.0.1",
    author="Bart Lamiroy",
    author_email="Bart.Lamiroy@univ-lorraine.fr",
    description="Experimental optimisation and regression tools for Flow Simulator",
    long_description=long_description,
    long_description_content_type="text/markdown",
    license="LGPL",
    url="https://github.com/mines-nancy/flowsim/",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: LGPL License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)