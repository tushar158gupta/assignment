import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // A library for generating unique IDs

// This is the main page for the affiliate dashboard.
const HomePage = () => {
  // State for affiliate data, clicks, and conversions
  const [affiliates, setAffiliates] = useState([
    { id: 1, name: 'Marketing Masters' },
    { id: 2, name: 'Traffic Titans' }
  ]);
  const [currentAffiliateId, setCurrentAffiliateId] = useState(1);
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [postbackUrl, setPostbackUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [selectedClickId, setSelectedClickId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // The base URL for the backend API
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Function to fetch data from the backend API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const clicksResponse = await fetch(`${backendUrl}/dashboard/clicks/${currentAffiliateId}`);
      const clicksData = await clicksResponse.json();
      if (clicksData.status === 'success') {
        setClicks(clicksData.data);
      }

      const conversionsResponse = await fetch(`${backendUrl}/dashboard/conversions/${currentAffiliateId}`);
      const conversionsData = await conversionsResponse.json();
      if (conversionsData.status === 'success') {
        setConversions(conversionsData.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setMessage({ type: 'error', text: 'Failed to load data from server.' });
    }
    setIsLoading(false);
  };

  // Fetch data on initial load and when the affiliate changes
  useEffect(() => {
    fetchData();
  }, [currentAffiliateId]);

  // Update the postback URL when the affiliate changes
  useEffect(() => {
 const url = `https://affiliate-mvp-five.vercel.app/api/postback?affiliate_id=${currentAffiliateId}&click_id={click_id}&amount={amount}&currency={currency}`;
    setPostbackUrl(url);
    setMessage(null);
  }, [currentAffiliateId]);

  // Simulate a click by calling the backend API
  const handleSimulatedClick = async () => {
    setIsLoading(true);
    const campaignId = 101; // Example campaign ID
    const clickId = uuidv4().substring(0, 8);
    try {
      const response = await fetch(`${backendUrl}/click?affiliate_id=${currentAffiliateId}&campaign_id=${campaignId}&click_id=${clickId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: `Simulated click tracked with click_id: ${clickId}` });
        await fetchData(); // Refresh data after successful click
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to track click.' });
    }
    setIsLoading(false);
  };

  // Simulate a postback by calling the backend API
  const handleSimulatedPostback = async () => {
    if (!selectedClickId) {
      setMessage({ type: 'error', text: 'Please select a click ID first.' });
      return;
    }
    setIsLoading(true);
    const amount = (Math.random() * 50 + 50).toFixed(2);
    const currency = 'USD';
    try {
      const response = await fetch(`${backendUrl}/postback?affiliate_id=${currentAffiliateId}&click_id=${selectedClickId}&amount=${amount}&currency=${currency}`);
      const data = await response.json();
      if (data.status === 'success') {
        setMessage({ type: 'success', text: `Conversion tracked successfully for click ID: ${selectedClickId}` });
        await fetchData(); // Refresh data after successful postback
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fire postback.' });
    }
    setIsLoading(false);
  };
  
  // Helper to format timestamps for display
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Affiliate Dashboard (MVP)
        </h1>
        
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Simulated Login</h2>
          <p className="text-gray-700 mb-4">
            Select an affiliate to view their dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              className="w-full text-black sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              value={currentAffiliateId}
              onChange={(e) => setCurrentAffiliateId(parseInt(e.target.value))}
            >
              {affiliates.map(affiliate => (
                <option key={affiliate.id} value={affiliate.id}>
                  {affiliate.name} (ID: {affiliate.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-2 text-green-800">
            Your Unique Postback URL
          </h2>
          <p className="text-gray-700 mb-4">
            This is the URL to provide to advertisers.
          </p>
          <div className="bg-green-100 p-3 rounded-md text-sm break-all font-mono text-green-900 shadow-inner">
            {postbackUrl}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold mb-2 text-purple-800">Simulate a Click</h3>
            <p className="text-gray-700 mb-4">
              Click the button to simulate a user clicking a tracking link.
            </p>
            <button
              onClick={handleSimulatedClick}
              disabled={isLoading}
              className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
            >
              {isLoading ? 'Processing...' : 'Simulate Click'}
            </button>
          </div>

          <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold mb-2 text-red-800">Simulate a Conversion</h3>
            <p className="text-gray-700 mb-4">
              Select a click and fire a postback to it.
            </p>
            <select
              className="w-full text-black p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
              value={selectedClickId}
              onChange={(e) => setSelectedClickId(e.target.value)}
            >
              <option value="">Select a tracked click...</option>
              {clicks.map(click => (
                <option key={click.id} value={click.click_id}>
                  Click ID: {click.click_id}
                </option>
              ))}
            </select>
            <button
              onClick={handleSimulatedPostback}
              disabled={!selectedClickId || isLoading}
              className={`w-full px-4 py-2 text-white rounded-md transition duration-150 ${selectedClickId ? 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {isLoading ? 'Processing...' : 'Simulate Postback'}
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md mb-8 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Clicks Logged
            </h2>
            {clicks.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clicks.map((click) => (
                      <tr key={click.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">{click.click_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(click.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No clicks logged yet for this affiliate.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Conversions
            </h2>
            {conversions.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {conversions.map((conv) => (
                      <tr key={conv.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">${conv.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{conv.currency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateTime(conv.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No conversions logged yet for this affiliate.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
