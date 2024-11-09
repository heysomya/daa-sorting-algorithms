import { useState } from 'react'

import axios from 'axios';


function App() {
  const [timeTaken, setTimeTaken] = useState([])

  const handleSelections = async (event) => {
    event.preventDefault();
    const form = event.target.form;
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);

    const allowedAlgorithms = ["merge", "heap", "quick1", "quick2", "insertion", "selection", "bubble"];

    const inputSize = form.querySelector('input[type="number"]').value;
    if (!inputSize || Number(inputSize) <= 0) {
      alert("Please enter a valid input size greater than zero.");
      return;
    }

    const isValidAlgorithm = selectedValues.every(algo => allowedAlgorithms.includes(algo));
    if (!isValidAlgorithm) {
      alert("One or more selected algorithms are invalid.");
      return;
    }

    if (selectedValues.length < 2) {
      alert("Please select at least two algorithms.");
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/sort', {
        algorithms: selectedValues,
        size: inputSize
      });
      setTimeTaken(res.data.times);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className=''>
      <div>
        <p className='text-9xl font-black'>Sorting Algorithms</p>
      </div>

      <div>
        <form action="" className='py-5'>
          <p className='text-xl font-extrabold'>Enter Input Size:</p>
          <input type='number' min={1} className='mt-2' />
          <p className='text-xl font-extrabold pt-5'>Choose 2 or more sorting algorithms to compare the time taken to sort the array:</p>
          <div className='mt-2'><label><input type="checkbox" value="merge" className='accent-violet-400' /> Merge Sort</label></div>
          <div><label><input type="checkbox" value="heap" /> Heap Sort</label></div>
          <div><label><input type="checkbox" value="quick1" /> Quick Sort 1</label></div>
          <div><label><input type="checkbox" value="quick2" /> Quick Sort 2</label></div>
          <div><label><input type="checkbox" value="insertion" /> Insertion Sort</label></div>
          <div><label><input type="checkbox" value="selection" /> Selection Sort</label></div>
          <div><label><input type="checkbox" value="bubble" /> Bubble Sort</label></div>
          <button type="submit" onClick={handleSelections} className='bg-violet-400 mt-2 px-4 py-2 rounded-md hover:bg-violet-700 duration-500'>Submit</button>
        </form>
      </div>

      <div>
        <p>Time taken by Algorithms:</p>
        {timeTaken.map((item, index) => {
          return (
            <div key={index}>
              <p><b>{item.algorithm}</b>: {item.time_taken} ms</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
