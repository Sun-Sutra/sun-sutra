export const processOCRTextWithAI = async (ocrText) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key is missing. Please add VITE_GROQ_API_KEY to your .env file.');
  }

  const prompt = `
    Analyze the following raw OCR text extracted from an electricity bill.
    Your task is to:
    1. Ignore OCR mistakes, typos, or irrelevant text.
    2. Identify and extract the following fields for an energy analysis form:
       - state (Name of the Indian state)
       - monthlyBill (The total bill amount, extract as a plain number string, e.g., "100000")
       - industry (The type of industry if mentioned)
       - consumerNumber (The 13-digit consumer number as a string)
       - discom (The electricity distribution company name)
       - htLt (Either "HT" or "LT")
       - tariffCategory (The tariff category code/name)
       - consumerCategory (The consumer category)
       - connectedLoad (The connected load with units, e.g., "50 kW")
       - sanctionedLoad (The sanctioned load with units)
       - contractDemand (The contract demand with units)
       - monthlyConsumption (The monthly consumption in kWh, e.g., "5000")
       - billingHistory (Any billing history information)
       - energyCharges (The energy charges amount)
       - fixedDemandCharges (The fixed/demand charges amount)
       - fac (The FAC amount)
       - electricityDuty (The electricity duty amount)
       - wheelingCharges (The wheeling charges amount, if shown)

    You must return a valid JSON object containing exactly these keys. If a field cannot be found, set its value to an empty string "".

    Raw OCR Text:
    """
    ${ocrText}
    """
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that parses electricity bill OCR text into structured JSON. Always output valid JSON only without markdown formatting blocks.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to communicate with AI API');
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    const parsedJSON = JSON.parse(resultText);
    
    return parsedJSON;
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error('Failed to extract data from the text: ' + error.message);
  }
};
