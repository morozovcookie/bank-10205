# -*- coding: utf-8 -*-

from django.test import TestCase


def get_in(key_string, d):
    keys = key_string.split('.')
    res = d
    for k in keys:
        if not isinstance(res, dict): return None
        res = res.get(k, None)
    return res


class GetInTest(TestCase):
    def setUp(self):
        self.data = {'a': {'b': {'e': 45}}}
        self.wrong_data = {'a': {'b': 45}}

    def getin_test(self):
        print(get_in('a.b.e', self.data))
        self.assertEqual(get_in('a.b.e', self.data), 45)

    def getin_wrong_path_test(self):
        self.assertEqual(get_in('a.b.c', self.wrong_data), None)
