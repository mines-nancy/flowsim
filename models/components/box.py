import math


class Box:
    def __init__(self, name):
        self._name = name

        self._t = 0
        self._size = [0]
        self._input = [0]  # number of inputs
        self._output = [0]  # number of outputs

        self._input_history = [0]
        self._output_history = [0]
        self._size_history = [0]

    def __str__(self):
        input = round(self.input(), 2)
        output = round(self.output(), 2)
        size = round(self.size(), 2)
        return f'Box {self._name} t={self._t} [{input}]\{size}/[{output}]'

    def step(self):
        self._input.append(0)
        self._output.append(0)
        self._size.append(0)
        self._t += 1

    def size(self, past=0):
        return self._size[self._t-past]

    def input(self, past=0):
        return self._input[self._t-past]

    def output(self, past=0):
        return self._output[self._t-past]

    def set_size(self, value):
        self._size[self._t] = value

    def set_input(self, value):
        self._input[self._t] = value

    def set_output(self, value):
        self._output[self._t] = value

    def full_size(self):
        return self.size() + self.input()

    def add(self, size):
        self._input[self._t] += size

    def remove(self, size):
        self._output[self._t] -= size

    def get_input_history(self):
        return list(self._input)

    def get_size_history(self):
        return list(self._size)

    def get_output_history(self):
        return list(self._output)


class BoxSource(Box):
    def __init__(self, name):
        Box.__init__(self, name)

    def step(self):
        super().step()
        self.set_output(self.output(1) + self.input(1))
        self.set_size(self.output(1) + self.input(1))

    def size(self):
        return self.output()


class BoxTarget(Box):
    def __init__(self, name):
        Box.__init__(self, name)

    def step(self):
        super().step()
        self.set_size(self.size(1) + self.input(1))