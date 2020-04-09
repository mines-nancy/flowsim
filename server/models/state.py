from models.box import Box
from models.history import History


class State:
    def __init__(self,
                 kpe: float,
                 kem: float,
                 kmg: float,
                 kmh: float,
                 khr: float,
                 khg: float,
                 krd: float,
                 krg: float,
                 tem: int,
                 tmg: int,
                 tmh: int,
                 thg: int,
                 thr: int,
                 time,
                 population,
                 recovered,
                 exposed,
                 infected,
                 hospitalized,
                 intensive_care,
                 exit_intensive_care,
                 dead,
                 ):

        self.population = population
        self.recovered = recovered
        self.exposed = exposed
        self.infected = infected
        self.hospitalized = hospitalized
        self.intensive_care = intensive_care
        self.exit_intensive_care = exit_intensive_care
        self.dead = dead
        self.time = time

        self.kpe = kpe
        self.kem = kem
        self.kmg = kmg
        self.kmh = kmh
        self.khr = khr
        self.khg = khg
        self.krd = krd
        self.krg = krg
        self.tem = tem
        self.tmg = tmg
        self.tmh = tmh
        self.thg = thg
        self.thr = thr

    def reinit_boxes(self):
        self.population.reinit()
        self.recovered.reinit()
        self.exposed.reinit()
        self.infected.reinit()
        self.hospitalized.reinit()
        self.intensive_care.reinit()
        self.exit_intensive_care.reinit()
        self.dead.reinit()

    def __str__(self):
        pop = self.exposed.size() + self.infected.size() + \
            self.hospitalized.size() + self.intensive_care.size() + \
            self.exit_intensive_care.size() + self.recovered.size() + self.dead.size()
        return f'{self.exposed} {self.infected} {self.hospitalized} {self.intensive_care} {self.exit_intensive_care} {self.recovered} {self.dead} POP={round(pop,2)}'

    def increment_time(self):
        self.time += 1

    def get_time0(self):
        return 0

    def get_past_size(self, history, boxname, delay):
        if delay == 1:  # current value correspond to previous size
            return getattr(self, boxname).value()

        past_state = history.get_last_state(self.time - delay)
        if past_state == None:
            return 0
        return getattr(past_state, boxname).size()

    def get_past_input(self, history, boxname, delay):
        past_state = history.get_last_state(self.time - delay)
        if past_state == None:
            return 0
        return getattr(past_state, boxname).input()

    def move(self,src,dest,delta):
        n = min(delta,src.value())
        src.remove(n)
        dest.add(delta)

    def exposed_to_infected(self, history):
        state0 = history.get_last_state(self.get_time0())
        if state0 == None:
            return

        state0_exposed_size = state0.exposed.size()
        previous_exposed_size = self.get_past_size(history, 'exposed', 1)
        infected_tem_size = self.get_past_size(history, 'infected', 1+self.tem)
        delta = self.kem * previous_exposed_size * \
            infected_tem_size / state0_exposed_size
        self.move(self.exposed, self.infected, delta)

    def infected_to_recovered(self, history):
        delta = self.kmg * self.get_past_input(history, 'infected', 1+self.tmg)
        # print(f'infected_to_recovered: {delta}')
        self.move(self.infected, self.recovered, delta)

    def infected_to_hospitalized(self, history):
        delta = self.kmh * self.get_past_input(history, 'infected', 1+self.tmh)
        # print(f'infected_to_hospitalized: {delta}')
        self.move(self.infected, self.hospitalized, delta)

    def hospitalized_to_recovered(self, history):
        delta = self.khg * \
            self.get_past_input(history, 'hospitalized', 1+self.thg)
        self.move(self.hospitalized, self.recovered, delta)

    def hospitalized_to_intensive_care(self, history):
        delta = self.khr * \
            self.get_past_input(history, 'hospitalized', 1+self.thr)
        self.move(self.hospitalized, self.intensive_care, delta)

    def intensive_care_to_exit_intensive_care(self, history):
        nb_exit_after_n_days = [0, 0, 0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.07,
                                0.08, 0.10, 0.12, 0.14, 0.13, 0.09, 0.05, 0.03, 0.02, 0.01, 0.01]
        delta = 0
        for i in range(len(nb_exit_after_n_days)):
            delta += nb_exit_after_n_days[i] * \
                self.get_past_input(history, 'intensive_care', (1+1+i)
                                    )  # +1 for previous, +1 for array element corresponds to 1 day

        self.move(self.intensive_care, self.exit_intensive_care, delta)

    def exit_intensive_care_to_recovered(self, history):
        delta = self.krg * \
            self.get_past_size(history, 'exit_intensive_care', 1)
        self.move(self.exit_intensive_care, self.recovered, delta)

    def exit_intensive_care_to_dead(self, history):
        delta = self.krd * \
            self.get_past_size(history, 'exit_intensive_care', 1)
        self.move(self.exit_intensive_care, self.dead, delta)
