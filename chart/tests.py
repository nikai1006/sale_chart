import time


def fab1(max):
    a, b = 0, 1
    start = time.time()
    for i in range(0, max):
        if i < 20:
            print(b)
        a, b = b, a + b
    end = time.time()
    print("fab1耗时：%.2fs" % (end - start))


def fab2(max):
    a, b = 0, 1
    for i in range(0, max):
        yield b
        a, b = b, a + b


# Create your tests here.
if __name__ == '__main__':
    a, b = 1, 1
    a, b = b, a + b
    print(a, b)
    max_num = 1000000
    start = time.time()
    fab_re = fab2(max_num)
    end = time.time()
    print("fab2耗时：%.2fs" % (end - start))
    for i in range(0, 10):
        print(next(fab_re))
    print('--------------------------')
    fab1(max_num)
