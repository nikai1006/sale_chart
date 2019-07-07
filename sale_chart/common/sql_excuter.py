from django.db import connection


def runquery(sql):
    print(sql)
    cursor = connection.cursor()
    cursor.execute(sql, None)
    col_names = [desc[0] for desc in cursor.description]
    queryset = []
    for row in cursor:
        # row = dict(zip(col_names, row))
        queryset.append(dict(zip(col_names, row)))
    return queryset


def findone(sql):
    print(sql)
    cursor = connection.cursor()
    cursor.execute(sql, None)
    col_names = [desc[0] for desc in cursor.description]
    row = cursor.fetchone()
    row = dict(zip(col_names, row))
    return row
