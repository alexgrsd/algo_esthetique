#!/usr/bin/python
# -*- coding: utf-8 -*-

# Love Letters
# copyright (c) 2014, 2024 Nick Montfort <nickm@nickm.com>
# based on a program by Christopher Strachey, 1953
# intended to work in Python 2 (>= 2.5) as well as 3, however:
#
# Copying and distribution of this file, with or without modification,
# are permitted in any medium without royalty provided the copyright
# notice and this notice are preserved. This file is offered as-is,
# without any warranty.
#
# Updated 10 March 2015 to correct the word lists. Sources are photographs
# of Christoper Stachey’s notes in the Bodleian Library from J.R. Carpenter
# and table 14.1 in Noah Wardrip-Fruin’s article “Digital Media Archaeology.”
# Updated 31 May 2018 for compatibility with Python 2 (2.5+) and 3.
# Updated 1 January 2024 for Memory Slam 2.0.

from sys import argv
from random import choice
import textwrap
from time import sleep

premier = ['Chéri(e)', 'Cher/Cher(e)', 'Mon trésor', 'Bijou']
second = ['mon canard', 'mon amour', 'mon petit', 'mon cœur']

adjectifs = [
    'adorable',
    'affectueux(se)',
    'amoureux(se)',
    'anxieux(se)',
    'ardent(e)',
    'avide',
    'haletant(e)',
    'brûlant(e)',
    'convoiteux(se)',
    'désireux(se)',
    'curieux(se)',
    'chéri(e)',
    'cher/chère',
    'dévoué(e)',
    'impatient(e)',
    'érotique',
    'fervent(e)',
    'tendrement attaché(e)',
    'impatient(e)',
    'passionné(e)',
    'petit(e)',
    'aimable',
    'transi(e) d’amour',
    'aimant(e)',
    'passionné(e)',
    'précieux(se)',
    'doux/douce',
    'plein(e) de compassion',
    'tendre',
    'insatisfait(e)',
    'rêveur/rêveuse',
]

noms = [
    'adoration',
    'affection',
    'ambition',
    'appétit',
    'ardeur',
    'charme',
    'désir',
    'dévouement',
    'empressement',
    'enchantement',
    'enthousiasme',
    'fantaisie',
    'compassion',
    'ferveur',
    'tendresse',
    'cœur',
    'faim',
    'engouement',
    'attirance',
    'nostalgie',
    'amour',
    'luxure',
    'passion',
    'ravissement',
    'sympathie',
    'tendresse',
    'soif',
    'souhait',
    'désir ardent',
]

adverbes = [
    'affectueusement',
    'avec anxiété',
    'ardemment',
    'avidement',
    'magnifiquement',
    'à bout de souffle',
    'brûlamment',
    'avec convoitise',
    'avec curiosité',
    'dévouément',
    'avec empressement',
    'avec ferveur',
    'tendrement',
    'impatiemment',
    'vivement',
    'avec amour',
    'passionnément',
    'séduisamment',
    'avec tendresse',
    'avec charme',
    'avec mélancolie',
]

verbes = [
    'adore',
    'attire',
    'prend soin de',
    'chéris',
    's’accroche à',
    'désire',
    'tient en haute estime',
    'espère',
    'a faim de',
    'est uni(e) à',
    'aime bien',
    'languit après',
    'aime',
    'convoite',
    'brûle pour',
    'se morfond pour',
    'précie',
    'soupire après',
    'tente',
    'a soif de',
    'chéris',
    'veut',
    'souhaite',
    'fait la cour à',
    'aspire à',
]


def maybe(words):
    if choice([False, True]):
        return ' ' + choice(words)
    return ''

def longer():
    return (
        ' My'
        + maybe(adjectifs)
        + ' '
        + choice(noms)
        + maybe(adverbes)
        + ' '
        + choice(verbes)
        + ' your'
        + maybe(adjectifs)
        + ' '
        + choice(noms)
        + '.'
    )

def shorter():
    return ' ' + choice(adjectifs) + ' ' + choice(noms) + '.'

def body():
    text = ''
    you_are = False
    for i in range(0, 5):
        type = choice(['longer', 'shorter'])
        if type == 'longer':
            text = text + longer()
            you_are = False
        else:
            if you_are:
                text = text[:-1] + ': my' + shorter()
                you_are = False
            else:
                text = text + ' You are my' + shorter()
                you_are = True
    return text

def letter():
    text = choice(premier) + ' ' + choice(second) + '\n\n' + \
           textwrap.fill(body(), 80) + '\n\n' + \
           '                            Yours ' + choice(adverbes) + '\n\n' + \
           '                                  M.U.C.' + '\n'
    return text.upper() if (len(argv) > 1 and argv[1] == '-c') else text

print('')
while True:
    print(letter())
    sleep(12.0)
