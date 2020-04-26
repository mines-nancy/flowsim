import numpy as np
import matplotlib.pyplot as plt

from models.sir_h.state import State
from models.sir_h.simulator import run_sir_h
from models.rule import RuleChangeField, RuleEvacuation


if __name__ == "__main__":
    dm_r = 9
    parameters = {'population': 1000000,
                  'patient0': 40,
                  'lim_time': 250,
                  'r': 1.0,
                  'beta': 3.31 / dm_r,
                  'kpe': 1.0,
                  'dm_incub': 4,
                  'dm_r': dm_r, 'dm_h': 6,
                  'dm_sm': 6, 'dm_si': 9, 'dm_ss': 14,
                  'pc_ir': 0.98, 'pc_ih': 0.02,
                  'pc_sm': 0.84, 'pc_si': 0.16,
                  'pc_sm_si': 0.21, 'pc_sm_dc': 0.79 * 0.25, 'pc_sm_out': 0.79 * 0.75,
                  'pc_si_dc': 0.4, 'pc_si_out': 0.6,
                  'pc_h_ss': 0.2, 'pc_h_r': 0.8}
    print(f'parameters={parameters}')

    day0 = 5  # start of simulation: 06/01/2020 => 5 days from 01/01/2020

    # number of days since 01/01/2020 -> number of residents in SI
    data_chu = {46: 1.5, 47: None, 48: None, 49: None,
                50: None, 51: None, 52: None, 53: 1.5, 54: 1.5,
                55: 1.5, 56: 1.5, 57: 1.5, 58: 1.5, 59: 3,
                60: 4.5, 61: 3, 62: 6, 63: 9, 64: 9,
                65: 12, 66: 10.5, 67: 12, 68: 12, 69: 13.5,
                70: 12, 71: 12, 72: 13.5, 73: 18, 74: 30,
                75: 33, 76: 42, 77: 51, 78: 63, 79: 76.5,
                80: 82.5, 81: 91.5, 82: 105, 83: 111, 84: 121.5,
                85: 144, 86: 142.5, 87: 153, 88: 148.5, 89: 156,
                90: 169.5, 91: 172.5, 92: 174, 93: 171, 94: 168,
                95: 168, 96: 162, 97: 156, 98: 153, 99: 145.5,
                100: 141, 101: 138, 102: 139.5, 103: 138, 104: 124.5,
                105: 109.5, 106: 105, 107: 100.5, 108: 99, 109: 99,
                110: 93, 111: 87}

    confinement = 70  # 16/03/2020 -> day0 + 70
    deconfinement = 126  # 11/05/2020 -> day0 + 126

    rules = [
        RuleChangeField(confinement,  'r',  1.0),
        RuleChangeField(confinement,  'beta', 0.4 / dm_r),
        RuleChangeField(deconfinement,  'r',  1.0),
        RuleChangeField(deconfinement,  'beta', 1.1 / dm_r),
    ]

    # number of days since day0 -> number of residents in SI
    data_day0 = {date-day0: data_chu[date]
                 for date in data_chu if date % 5 == 0}
    print(list(data_day0.keys()))

    series = run_sir_h(parameters, rules)
    corrected_series = run_sir_h(parameters, rules, data_day0)

    SI = series['SI']
    corrected_SI = corrected_series['SI']
    # print(corrected_SI)

    x = np.linspace(0, len(SI), len(SI))
    plt.plot(x, SI)
    plt.plot(x, corrected_SI)
    plt.plot(list(data_day0.keys()), list(data_day0.values()), 'x')
    plt.savefig('filename')
