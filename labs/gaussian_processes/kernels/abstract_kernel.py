# -*- coding: utf-8 -*-
# The code on gaussian processes gas been adapted from Imperial College's CO493
# "Probabilistic Inference" lead by Dr. Mark Van der Wilk
"""
    This file is part of FLOWSIM.

    FLOWSIM is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    FLOWSIM is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with FLOWSIM.  If not, see <https://www.gnu.org/licenses/>.

    Copyright (c) 2020 Paul Festor
    e-mail: paul.festor2@etu.univ-lorraine.fr
"""
import abc

import numpy as np


class Kernel(metaclass=abc.ABCMeta):
    def __init__(self,
                 log_amplitude: float,
                 log_length_scale: float,
                 log_noise_scale: float
                 ):
        self._log_amplitude = log_amplitude
        self._log_length_scale = log_length_scale
        self._log_noise_scale = log_noise_scale

    def set_parameters(self,
                       log_amplitude: float,
                       log_length_scale: float,
                       log_noise_scale: float,
                       ) -> None:
        self.log_amplitude = log_amplitude
        self.log_length_scale = log_length_scale
        self.log_noise_scale = log_noise_scale

    @property
    def log_amplitude(self):
        return self._log_amplitude

    @property
    def log_length_scale(self):
        return self._log_length_scale

    @property
    def log_noise_scale(self):
        return self._log_noise_scale

    @log_amplitude.setter
    def log_amplitude(self, log_amplitude: float):
        log_amplitude = np.clip(log_amplitude, -3, 3)
        self._log_amplitude = log_amplitude

    @log_length_scale.setter
    def log_length_scale(self, log_length_scale: float):
        log_length_scale = np.clip(log_length_scale, -3, 3)
        self._log_length_scale = log_length_scale

    @log_noise_scale.setter
    def log_noise_scale(self, log_noise_scale: float):
        log_noise_scale = np.clip(log_noise_scale, -3, 3)
        self._log_noise_scale = log_noise_scale

    @property
    def amplitude_squared(self):
        return np.exp(self.log_amplitude * 2)

    @property
    def length_scale(self):
        return np.exp(self.log_length_scale)

    @property
    def noise_scale_squared(self):
        return np.exp(self.log_noise_scale * 2)

    @abc.abstractmethod
    def get_covariance_matrix(self,
                              X: np.ndarray,
                              Y: np.ndarray,
                              ):
        """
        :param X: numpy array of size n_1 x m for which each row (x_i) is a data point at which the objective function can be evaluated
        :param Y: numpy array of size n_2 x m for which each row (y_j) is a data point at which the objective function can be evaluated
        :return: numpy array of size n_1 x n_2 for which the value at position (i, j) corresponds to the value of
        k(x_i, y_j), where k represents the kernel used.
        """
        pass

    def __call__(self,
                 X: np.ndarray,
                 Y: np.ndarray,
                 ):
        return self.get_covariance_matrix(X, Y)
