---
title: doctestを使ってpythonの簡単な単体テストを書く
category: 'development'
keywords: ['python', 'test', 'doctest']
---

doctestはpythonに標準で搭載されているテストツールで、docstring("""で囲まれたドキュメンテーション文字列)に書かれた対話実行例をテストとして実行します。入力と出力をコメントに記述するだけという非常にシンプルな仕組みなので、ちょっとした処理の確認に役立ちます。

## 記述例

```python
import doctest

def average(*numbers):
    """
    This method returns the average value of args.
    >>> average(1, 2)
    1.5
    """
    return sum(numbers)/len(numbers)

if __name__ == '__main__':
    doctest.testmod()
```

上記のコードを実行すると

```bash
$ python hello.py
**********************************************************************
File "hello.py", line 6, in __main__.average
Failed example:
    average(1, 2)
Expected:
    0.5
Got:
    1
**********************************************************************
1 items had failures:
   1 of   1 in __main__.average
***Test Failed*** 1 failures.
```

失敗しました。除算を用いるので引数を浮動小数点として扱うように修正します。

```python
import doctest

def average(*numbers):
    """
    This method returns the average value of args.
    >>> average(1, 2)
    1.5
    """
    numbers = [float(number) for number in numbers]
    return sum(numbers)/len(numbers)

if __name__ == '__main__':
    doctest.testmod()
```

```bash
$ python hello.py
```

実行結果が何も表示されません。すなわちテストが通ったことを意味します。通ったテストのログはオプション-vをつけることで表示することが可能です。

```bash
$python hello.py -v
Trying:
    average(1, 2)
Expecting:
    1.5
ok
1 items had no tests:
    __main__
1 items passed all tests:
   1 tests in __main__.average
1 tests in 2 items.
1 passed and 0 failed.
Test passed.
```

## python -m doctest -v [ファイル名]

Python2.6以降にはdoctest.testmod()を実行するコマンドラインショートカット(-m doctest)があり、doctest.testmod()をコード内に記述する必要がなくなりました。

```python
def average(*numbers):
    """
    This method returns the average value of args.
    >>> average(1, 2)
    1.5
    """
    numbers = [float(number) for number in numbers]
    return sum(numbers)/len(numbers)

if __name__ == '__main__':
    pass
```

main関数を空にしてコマンドラインからテストします。

```bash
$ python -m doctest -v hello.py
Trying:
    average(1, 2)
Expecting:
    1.5
ok
1 items had no tests:
    hello
1 items passed all tests:
   1 tests in hello.average
1 tests in 2 items.
1 passed and 0 failed.
Test passed.
```

テストが実行されました。

注意点として、doctestは出力の完全一致を求めるので、スペースの有無や辞書の順序に気を配ってテストを書く必要があります。詳しくはドキュメントをご覧ください。

参考: [25.2. doctest — 対話的な実行例をテストする](http://docs.python.jp/2/library/doctest.html)

## 2014.07.08 追記

出力結果をTrue, Falseで判断することで、表記揺れによるテスト失敗を回避することができました。また、この方法では弾く(Falseを想定した)テストも書けるので便利です。

```python
def average(*numbers):
    """
    This method returns the average value of numbers.
    >>> average(0, 2) #failed
    1
    >>> average(0, 2) #ok
    1.0
    >>> average(0, 2) == 1 #ok
    True
    >>> average(0, 2) == 1.0 #ok
    True
    >>> average(0, 2) == 2.0 #ok
    False
    """
    numbers = [float(number) for number in numbers]
    return sum(numbers)/len(numbers)

if __name__ == '__main__':
    pass
```

```bash
$ python -m doctest -v hello.py
Trying:
    average(0, 2) #failed
Expecting:
    1
**********************************************************************
File "hello.py", line 4, in hello.average
Failed example:
    average(0, 2) #failed
Expected:
    1
Got:
    1.0
Trying:
    average(0, 2) #ok
Expecting:
    1.0
ok
Trying:
    average(0, 2) == 1 #ok
Expecting:
    True
ok
Trying:
    average(0, 2) == 1.0 #ok
Expecting:
    True
ok
Trying:
    average(0, 2) == 2.0 #ok
Expecting:
    False
ok
1 items had no tests:
    hello
**********************************************************************
1 items had failures:
   1 of   5 in hello.average
5 tests in 2 items.
4 passed and 1 failed.
***Test Failed*** 1 failures.
```
