import React, { useState } from 'react';
import FFLSelector from './FFLSelector';
import { FFL } from './CustomShippingStep';

const FFLSelectorSection: React.FC<{
  show: boolean;
  fflLocations: FFL[] | null;
  selectedFFL: FFL | null;
  setSelectedFFL: React.Dispatch<React.SetStateAction<FFL | null>>;
  setPickupAtSS: React.Dispatch<React.SetStateAction<boolean>>;
  shootStraightIds: number[];
  pickupAtSS: boolean;
  shootStraightLocations: FFL[];
  getFfls: (params: { searchTerms: string; state: string }) => Promise<void>;
}> = ({ show, fflLocations, selectedFFL, setSelectedFFL, setPickupAtSS, getFfls, shootStraightLocations, shootStraightIds, pickupAtSS }) => {
  const [input, setInput] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const stateOptions = [
    '', 'AL', 'AZ', 'AR', 'DE', 'FL', 'GA', 'ID', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
    'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NM', 'NC', 'ND', 'OH', 'OK',
    'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WV', 'WI', 'WY'
  ];


  const handleSelectFFL = (ffl: FFL) => {

    if (shootStraightIds.includes(Number(ffl?.id))) {
      setPickupAtSS(true);
    }


    setSelectedFFL(ffl || null);
  };

  const handleGetFfls = () => {
    getFfls({ searchTerms: input, state: selectedState });
  }

  return show ? (
    <>
      {!pickupAtSS && (
        <div className="ffl-search-container">
          <input
            className="ffl-search-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter FFL name, city, or zip"
          />
          <select
            className="ffl-search-input"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{ minWidth: 50 }}
          >
            <option value="">State</option>
            {stateOptions.slice(1).map((abbr) => (
              <option key={abbr} value={abbr}>{abbr}</option>
            ))}
          </select>
          <button
            className="ffl-search-button"
            type="button"
            onClick={handleGetFfls}
          >
            Search
          </button>
        </div>
      )}
      <FFLSelector
        ffls={fflLocations}
        handleSelectFFL={handleSelectFFL}
        selectedFFL={selectedFFL}
        pickupAtSS={pickupAtSS}
        shootStraightLocations={shootStraightLocations}
      />
    </>
  ) : null;
};

export default FFLSelectorSection;
