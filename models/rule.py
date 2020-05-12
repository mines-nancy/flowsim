

class Rule:
    def __init__(self, date):
        self._date = date

    def date(self):
        return self._date


class RuleChangeField(Rule):
    def __init__(self, date, field, value):
        Rule.__init__(self, date)
        self._field = field
        self._value = value

    def __repr__(self):
        return f'ChangeField at t={self._date} {self._field}={self._value}'

    def apply(self, state):
        state.change_value(self._field, self._value)


class RuleForceMove(Rule):
    def __init__(self, date, src, dest, value):
        Rule.__init__(self, date)
        self._src = src
        self._dest = dest
        self._value = value

    def __repr__(self):
        return f'ForceMove at t={self._date} {self._src}->{self._dest}={self._value}'

    def apply(self, state):
        state.force_move(self._src, self._dest, self._value)


def apply_rules(state, rules):
    applicable_rules = [rule for rule in rules if state.time == rule.date()]
    for rule in applicable_rules:
        rule.apply(state)


def apply_force_move(state, src, dest, data_chu):
    date = state.time
    if date in data_chu and data_chu[date] != None:
        delta = state.box(src).size() - data_chu[date]
        if delta > 0:
            rule = RuleForceMove(date, src, dest, delta)
            rule.apply(state)
        elif delta < 0:
            rule = RuleForceMove(date, dest, src, 0-delta)
            rule.apply(state)