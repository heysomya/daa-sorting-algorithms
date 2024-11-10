from flask import Flask, request, jsonify
from flask_cors import CORS

from copy import deepcopy
import random
import time
import sys

sys.setrecursionlimit(10**6)

"""
1. Project 1 (Sorting Algorithms)
Implement and compare the following sorting algorithm :
    Mergesort
    Heapsort
    Quicksort (Regular quick sort* and quick sort using 3 medians)
    Insertion sort
    Selection sort
    Bubble sort
"""


class Sorting:
    def time_function(self, func, *args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        elapsed_time = round((end_time - start_time) * 1000, 3)
        return elapsed_time

    def randomArrayGenerator(self, size):
        arr = []
        for i in range(size + 1):
            ele = random.randint(1, size)
            arr.append(ele)
        return arr

    def mergeSort(self, arr):
        def merge(arr, l, m, r):
            i = l
            j = m + 1

            temp = []
            while i <= m and j <= r:
                if arr[i] <= arr[j]:
                    temp.append(arr[i])
                    i += 1
                else:
                    temp.append(arr[j])
                    j += 1

            while i <= m:
                temp.append(arr[i])
                i += 1

            while j <= r:
                temp.append(arr[j])
                j += 1

            for i in range(len(temp)):
                arr[l + i] = temp[i]

        def mergeSortHelper(arr, l, r):
            if l >= r:
                return

            mid = (l + r) // 2
            mergeSortHelper(arr, l, mid)
            mergeSortHelper(arr, mid + 1, r)
            merge(arr, l, mid, r)

        # driver code for merge sort
        start = 0
        end = len(arr) - 1
        mergeSortHelper(arr, start, end)
        return arr

    def heapSort(self, arr):
        def heapify(arr, n, i):
            # Set the largest as root initially
            largest = i
            left = 2 * i + 1  # Left child index
            right = 2 * i + 2  # Right child index

            # Check if the left child exists and is greater than the root
            if left < n and arr[left] > arr[largest]:
                largest = left

            # Check if the right child exists and is greater than the current largest
            if right < n and arr[right] > arr[largest]:
                largest = right

            # If largest is not the root, swap and continue heapifying
            if largest != i:
                arr[i], arr[largest] = arr[largest], arr[i]  # Swap
                # Recursively heapify the affected subtree
                heapify(arr, n, largest)

        # driver code for heap sort
        n = len(arr)

        # Build a max-heap
        for i in range(n // 2 - 1, -1, -1):
            heapify(arr, n, i)

        # Extract elements from heap one by one
        for i in range(n - 1, 0, -1):
            # Move the root to the end of the array
            arr[i], arr[0] = arr[0], arr[i]
            # Heapify the reduced heap
            heapify(arr, i, 0)

        return arr

    def quickSort1(self, arr):
        def partition(arr, start, end):
            # picking the first element as the pivot
            p_element = arr[start]

            c = 0
            for i in range(start, end + 1):
                if arr[i] < p_element:
                    c += 1

            p_idx = start + c

            arr[start], arr[p_idx] = arr[p_idx], arr[start]

            while start < end:
                if arr[start] < p_element:
                    start += 1
                elif arr[end] >= p_element:
                    end -= 1
                else:
                    arr[start], arr[end] = arr[end], arr[start]
                    start += 1
                    end -= 1

            return p_idx

        def quickSortHelper(arr, start, end):
            if start < end:
                p_idx = partition(arr, start, end)

                quickSortHelper(arr, start, p_idx - 1)
                quickSortHelper(arr, p_idx + 1, end)

        # driver code for quick sort
        start = 0
        end = len(arr) - 1
        quickSortHelper(arr, start, end)
        return arr

    def quickSort2(self, arr):
        pass

    def insertionSort(self, arr):
        n = len(arr)

        for i in range(n):
            j = i
            key = arr[j]
            while j > 0 and key < arr[j - 1]:
                arr[j] = arr[j - 1]
                j -= 1
            arr[j] = key

        return arr

    def selectionSort(self, arr):
        n = len(arr)

        # Run loop till the second last element
        for i in range(n - 1):
            # Find min in unsorted part of array
            minIdx = i
            for j in range(i, n):
                if arr[j] < arr[minIdx]:
                    minIdx = j

            # Swap the current number and min in unsorted part
            temp = arr[i]
            arr[i] = arr[minIdx]
            arr[minIdx] = temp

        return arr

    def bubbleSort(self, arr):
        n = len(arr)

        # keep a swapped flag to check if any swapping takes place
        # after 1st loop, exit if the array is already sorted.
        swapped = False

        for i in range(n - 1):
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:
                    swapped = True

                    temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp

            if not swapped:
                return arr

        return arr


app = Flask(__name__)
CORS(app)
sorting = Sorting()


@app.route("/sort", methods=["POST"])
def sort():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    algorithms = data.get("algorithms")
    size = int(data.get("size"))

    if not size or not algorithms:
        return jsonify({"error": "Invalid input"}), 400

    arr = sorting.randomArrayGenerator(size)
    times = []
    for algorithm in algorithms:
        if algorithm == "merge":
            time_taken = sorting.time_function(sorting.mergeSort, deepcopy(arr))
            times.append({"algorithm": "Merge Sort", "time_taken": time_taken})
        elif algorithm == "heap":
            time_taken = sorting.time_function(sorting.heapSort, deepcopy(arr))
            times.append({"algorithm": "Heap Sort", "time_taken": time_taken})
        elif algorithm == "quick1":
            time_taken = sorting.time_function(sorting.quickSort1, deepcopy(arr))
            times.append({"algorithm": "Quick Sort", "time_taken": time_taken})
        elif algorithm == "quick2":
            time_taken = sorting.time_function(sorting.quickSort1, deepcopy(arr))
            times.append({"algorithm": "QS (3 Medians)", "time_taken": time_taken})
        elif algorithm == "insertion":
            time_taken = sorting.time_function(sorting.insertionSort, deepcopy(arr))
            times.append({"algorithm": "Insertion Sort", "time_taken": time_taken})
        elif algorithm == "selection":
            time_taken = sorting.time_function(sorting.selectionSort, deepcopy(arr))
            times.append({"algorithm": "Selection Sort", "time_taken": time_taken})
        elif algorithm == "bubble":
            time_taken = sorting.time_function(sorting.bubbleSort, deepcopy(arr))
            times.append({"algorithm": "Bubble Sort", "time_taken": time_taken})
        else:
            return jsonify({"error": "Unknown sorting algorithm"}), 400

    return jsonify({"times": times})


if __name__ == "__main__":
    app.run(debug=True)
