import React from 'react';
import DataTable from 'react-data-table-component';

const TaskTable = ({ data, handleEdit, handleDelete, handleMarkAsComplete }) => {
  const columns = [
    {
      name: 'Task',
      selector: row => row.task,
      sortable: true,
      cell: row => <div className={row.status === 'Completed' ? 'line-through text-gray-500' : ''}>{row.task}</div>,
    },
    {
      name: 'Due Date',
      selector: row => row.due_date,
      sortable: true,
      cell: row => <div className={row.status === 'Completed' ? 'line-through text-gray-500' : ''}>{row.due_date}</div>,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === 'Completed' ? 'bg-green-100 text-green-800' :
            row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex items-center space-x-2">
          {row.status !== 'Completed' && (
            <button onClick={() => handleMarkAsComplete(row.id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs font-semibold">Mark as Complete</button>
          )}
          <button onClick={() => handleEdit(row)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs font-semibold">Edit</button>
          <button onClick={() => handleDelete(row.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs font-semibold">Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '250px'
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        backgroundColor: '#f4f7f6',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
      },
    },
    rows: {
      style: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#ffffff',
        },
        '&:nth-of-type(even)': {
          backgroundColor: '#f9fafb',
        },
        '&:hover': {
          backgroundColor: '#f1f5f9',
        },
      },
    },
    pagination: {
      style: {
        borderTop: 'none',
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        pointerOnHover
        customStyles={customStyles}
        noHeader
      />
    </div>
  );
};

export default TaskTable;