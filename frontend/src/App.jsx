import { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function App() {
  const [timeTaken, setTimeTaken] = useState([]);
  const [error, setError] = useState("");
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const allowedAlgorithms = [
    { label: "Merge Sort", value: "merge" },
    { label: "Heap Sort", value: "heap" },
    { label: "Quick Sort", value: "quick1" },
    { label: "QS (3 Medians)", value: "quick2" },
    { label: "Insertion Sort", value: "insertion" },
    { label: "Selection Sort", value: "selection" },
    { label: "Bubble Sort", value: "bubble" }
  ];

  const toggleAlgorithmSelection = (algorithm) => {
    setSelectedAlgorithms((prevSelected) =>
      prevSelected.includes(algorithm)
        ? prevSelected.filter((item) => item !== algorithm)
        : [...prevSelected, algorithm]
    );
  };

  const handleSelections = async (event) => {
    event.preventDefault();
    const inputSize = event.target.form.querySelector('input[type="number"]').value;

    // Clear previous error
    setError("");

    // Validate input size
    if (!inputSize || Number(inputSize) <= 0) {
      setError("Please enter a valid input size greater than zero.");
      return;
    }

    // Ensure at least two algorithms are selected
    if (selectedAlgorithms.length < 2) {
      setError("Please select at least two algorithms.");
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/sort', {
        algorithms: selectedAlgorithms,
        size: inputSize
      });
      const newTimes = allowedAlgorithms.map(algo => {
        const algoTime = res.data.times.find(time => time.algorithm === algo.label);
        return { algorithm: algo.label, time_taken: algoTime ? algoTime.time_taken : 0 };
      });

      setTimeTaken(newTimes);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data. Please try again later.");
    }
  };

  const chartData = {
    labels: timeTaken.map(item => item.algorithm),
    datasets: [
      {
        label: 'Time Taken (ms)',
        data: timeTaken.map(item => item.time_taken),
        backgroundColor: '#fb7185',
        borderColor: '#fb7185',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainaspectratio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true, text: 'Sorting Algorithm Runtime Comparison', color: '#fb7185', font: {
          size: 20,
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#fb7185',  // Change x-axis labels color here
            font: {
              size: 14, // Adjust x-axis label font size
            }
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#fb7185',  // Change y-axis labels color here
            font: {
              size: 14, // Adjust y-axis label font size
            }
          }
        },
      }
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-left text-gray-200 ">
        <p>Sorting</p>
        <p>Algorithms</p>
      </div>

      <div>
        <form action="">
          <h4 className='mt-10 text-lg sm:text-xl text-white'>Enter Input Size:</h4>
          <input type="number" className="p-2 mb-4 w-full sm:w-auto rounded-sm text-rose-500" />

          <h4 className='mt-5 text-lg sm:text-xl text-white'>Select 2 or more sorting algorithms:</h4>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {allowedAlgorithms.map((algo) => (
              <div
                key={algo.value}
                onClick={() => toggleAlgorithmSelection(algo.value)}
                className={`p-4 rounded-xl cursor-pointer duration-200 ${selectedAlgorithms.includes(algo.value) ? "border-4 border-rose-500 bg-gray-200 text-gray-700" : "border-4 border-gray-200 hover:border-rose-300 bg-gray-200 text-gray-700"
                  }`}
              >
                {algo.label}
              </div>
            ))}
          </div>

          <button type="submit" onClick={handleSelections} className="mt-4 px-4 py-2 bg-rose-400 text-white rounded hover:bg-rose-500">
            Submit
          </button>
        </form>

        {error && <p className="mt-2 font-bold text-white">{error}</p>}
      </div>

      {!error && (
        <div className='w-full mt-10 text-white'>
          <h4 className='mt-10 text-lg sm:text-xl text-rose-400'>Time taken by Algorithms:</h4>
          {timeTaken.filter(item => item.time_taken > 0).length > 0 ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">Algorithm</th>
                  <th className="border px-4 py-2 text-left">Time Taken (ms)</th>
                </tr>
              </thead>
              <tbody>
                {timeTaken
                  .filter(item => item.time_taken > 0)
                  .map((item, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{item.algorithm}</td>
                      <td className="border px-4 py-2">{item.time_taken} ms</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p>No valid algorithms selected or all have 0ms.</p>
          )}
          {timeTaken.length > 0 && (
            <div className="w-full h-screen mt-10">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
