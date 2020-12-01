#!/usr/bin/env python

import os.path as path
import re
import sys

project_path = path.normpath(path.join(path.dirname(sys.argv[0]), '..'))
shogi_js_path = path.join(project_path, 'src/shogi.js')
js_api_md_path = path.join(project_path, 'JS_API.md')

doc_comment_regex = re.compile(
    r'^/\*\*(.*?)\*/\n((const|var|function) ([a-zA-Z]+))?',
    re.DOTALL | re.MULTILINE)
markdown_annotation_regex = re.compile(r'^@markdown', re.MULTILINE)
public_annotation_regex = re.compile(r'^@public', re.MULTILINE)
param_annotation_regex = re.compile(r'^@param {.+} ([$a-zA-Z]+)', re.MULTILINE)

def generate_doc(js_content):
    result = ''
    for mo in doc_comment_regex.finditer(js_content):
        comment = filter_comment(mo.group(1))
        if markdown_annotation_regex.search(comment):
            result += markdown_comment(comment)
        elif public_annotation_regex.search(comment):
            result += definition_comment(comment, mo.group(3), mo.group(4))
    return result

def filter_comment(raw_comment):
    lines = []
    for line in raw_comment.split('\n'):
        lines.append(line.lstrip(' *').rstrip())
    return '\n'.join(lines).strip()

def markdown_comment(comment):
    lines = []
    for line in comment.split('\n'):
        if not markdown_annotation_regex.match(line):
            lines.append(line)
    return '\n'.join(lines) + '\n\n'

def definition_comment(comment, kind, name):
    lines = []
    params = []
    in_comment = False
    for line in comment.split('\n'):
        if public_annotation_regex.match(line):
            continue
        elif line.startswith('@') and not in_comment:
            lines.append('\n```')
            in_comment = True
        elif not line.startswith('@') and in_comment:
            lines.append('```\n')
            in_comment = False

        mo = param_annotation_regex.match(line)
        if mo:
            params.append(mo.group(1))

        lines.append(line)

    if kind == 'function':
        title = '`Shogi.' + name + '(' + ', '.join(params) + ')`'
    elif kind == 'const':
        title = '`Shogi.' + name + '`'
    else:
        title = 'type `' + name + '`'

    lines.insert(0, '### ' + title + '\n')

    return '\n'.join(lines) + '\n\n'

with open(shogi_js_path) as f:
    doc = generate_doc(f.read())
    with open(js_api_md_path, 'w') as doc_f:
        doc_f.write(doc)
