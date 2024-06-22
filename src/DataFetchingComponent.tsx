import React, { useEffect, useState } from 'react';

interface Data {
  user_id: number;
  query_id: number;
  query_text: string;
  llm_id: number;
  response_id: number;
  response_text: string;
  comment: string;
  conversation_id: number;
}

interface Error {
  message: string;
}

const DataFetchingComponent: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('https://gptitor.onrender.com/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error: Error) => {
        setError({ message: error.message });
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataFetchingComponent;
