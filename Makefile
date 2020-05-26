.PHONY: help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install:
	pip install -r requirements.txt

start: venv
	python3 -O app.py

unit: venv
	. venv/bin/activate; python3 -m unittest discover -v

venv: venv/bin/activate

venv/bin/activate: requirements.txt
	test -d venv || python3 -m venv venv
	. venv/bin/activate; pip install -Ur requirements.txt
	touch venv/bin/activate

lib: venv
	rm -rf library_build/build
	rm -rf library_build/dist
	rm -rf library_build/flowsim.egg-info
	cd library_build; python3 setup.py sdist bdist_wheel

clean:
	rm -rf venv
	find . -name "*.pyc" -delete
