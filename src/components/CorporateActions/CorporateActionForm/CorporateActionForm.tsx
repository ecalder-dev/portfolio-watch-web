import { useEffect, useState } from 'react';
import './CorporateActionForm.css';
import CorporateAction from '../../../models/CorporateAction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import corporateActionService from '../../../services/CorporateActionService';

const typeList = ['MERGE', 'SPIN', 'SPLIT'];

export const getDescriptionOfType = (type: string): string => {
  switch (type) {
    case 'MERGE':
      return 'Merger';
    case 'SPIN':
      return 'Spin Off';
    case 'SPLIT':
      return 'Split';
    default:
      return null;
  }
}

const isValidNewCorporateAction = (corporateAction: CorporateAction): boolean => {
  return true;
}

const CorporateActionForm = () => {
  const { id } = useParams<{ id }>()
  const [corporateActionId, setCorporateActionId] = useState(undefined);
  const [type, setType] = useState('MERGE');
  const [oldSymbol, setOldSymbol] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [originalPrice, setOriginalPrice] = useState(0);
  const [spinOffPrice, setSpinOffPrice] = useState(0);
  const [ratioAntecedent, setRatioAntecedent] = useState(0);
  const [ratioConsequent, setRatioConsequent] = useState(0);
  const [dateOfEvent, setDateOfEvent] = useState(new Date());
  const history = useHistory();

  const handleInputChange = (e: any) => {
    let value = e.target.value;
    let pattern = e.target.pattern;
    let name = e.target.name;

    if (pattern && value && !value.match(pattern)) {
      return;
    } else {
      switch (name) {
        case 'type': {
          setType(value)
          break;
        }
        case 'oldSymbol': {
          setOldSymbol(value ? value.toUpperCase() : null)
          break;
        }
        case 'newSymbol': {
          setNewSymbol(value ? value.toUpperCase() : null)
          break;
        }
        case 'originalPrice': {
          setOriginalPrice(value);
          break;
        }
        case 'spinOffPrice': {
          setSpinOffPrice(value);
          break;
        }
        case 'ratioAntecedent': {
          setRatioAntecedent(value);
          break;
        }
        case 'ratioConsequent': {
          setRatioConsequent(value);
          break;
        }
      }
    }
  }

  const handleSubmit = () => {
    let corporateAction: CorporateAction;
    console.log(type);
    corporateAction = {
      id: corporateActionId,
      type: type,
      oldSymbol: oldSymbol,
      newSymbol: newSymbol,
      originalPrice: originalPrice,
      spinOffPrice: spinOffPrice,
      ratioAntecedent: ratioAntecedent,
      ratioConsequent: ratioConsequent,
      dateOfEvent: dateOfEvent
    };

    if (!isValidNewCorporateAction(corporateAction)) {
      return;
    }

    if (corporateAction.id) {
      corporateActionService.putCorporateAction(corporateAction).then((json) => {
        if (json.data) {
          history.push('/corporate-actions');
        }
      });
    } else {
      corporateActionService.postCorporateAction(corporateAction).then((json) => {
        if (json.data) {
          history.push('/corporate-actions');
        }
      });
    }
  }

  const deleteCorporateAction = () => {
    if (window.confirm('Are you sure you want to delete this corporate action?')) {
      corporateActionService.deleteCorporateAction(corporateActionId)
        .then(() => {
          history.push('/corporate-actions');
        })
        .catch(err => {
          console.log(err.message);
          alert('CorporateAction was not deleted.')
        });
    }
  }

  useEffect(() => {
    let isSubscribed = true;
    if (id) {
      corporateActionService.getCorporateAction(id).then((json) => {
        if (json.data && isSubscribed) {
          let corporateAction: CorporateAction = json.data;
          setCorporateActionId(corporateAction.id);
          setType(corporateAction.type);
          setOldSymbol(corporateAction.oldSymbol);
          setNewSymbol(corporateAction.newSymbol);
          setOriginalPrice(corporateAction.originalPrice);
          setSpinOffPrice(corporateAction.spinOffPrice);
          setRatioAntecedent(corporateAction.ratioAntecedent);
          setRatioConsequent(corporateAction.ratioConsequent);
          setDateOfEvent(new Date(corporateAction.dateOfEvent));
        } else {
          history.push('/corporate-actions');
        }
      }).catch((err) => {
        console.log(err.message);
      });
    }
    return () => { isSubscribed = false };
  }, [id, history]);

  return (
    <div className='CorporateActionForms'>
      <h1 className='title'>New Corporate Action</h1>
      <form>
        <div className='entry-row'>
        <div className="entry">
            <label>Type</label>
            <select
              name="type"
              onChange={e => setType(e.target.value)}
              value={type}
              id="select-type"
            >
              {typeList.map((type: string, index: number) => (
                <option key={"type-" + index} value={type}>
                  {getDescriptionOfType(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='entry-row'>
          <div className='entry'>
            <label>Old Symbol</label>
            <input
              value={oldSymbol}
              name='oldSymbol'
              pattern='^[A-z]{1,5}$'
              onInput={(e) => handleInputChange(e)}
            />
          </div>
          <div className='entry'>
            <label>New Symbol</label>
            <input
              value={newSymbol}
              name='newSymbol'
              pattern='^[A-z]{1,5}$'
              onInput={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className='entry-row'>
          <div className='entry'>
            <label>Original Price</label>
            <input
              value={originalPrice}
              pattern='^\d*(\.\d{0,10})?$'
              name='originalPrice'
              onInput={(e) => handleInputChange(e)}
            />
          </div>
          <div className='entry'>
            <label>Spin Off Price</label>
            <input
              value={spinOffPrice}
              pattern='^\d*(\.\d{0,10})?$'
              name='spinOffPrice'
              onInput={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className='entry-row'>
          <div className='entry'>
            <label>Ratio Antecedent</label>
            <input
              value={ratioAntecedent}
              pattern='^\d*(\.\d{0,10})?$'
              name='ratioAntecedent'
              onInput={(e) => handleInputChange(e)}
            />
          </div>
          <div className='entry'>
            <label>Ratio Consequent</label>
            <input
              value={ratioConsequent}
              pattern='^\d*(\.\d{0,10})?$'
              name='ratioConsequent'
              onInput={(e) => handleInputChange(e)}
            />
          </div>
        </div>
        <div className='entry-row'>
          <div className='entry'>
            <label>Date of Event</label>
            <DatePicker
              selected={dateOfEvent}
              onChange={(date) =>
                setDateOfEvent(date as Date)
              }
              dateFormat='M/d/yyyy'
            />
          </div>
        </div>
      </form >
      <div className='entry-row'>
        <button onClick={() => handleSubmit()}>Submit</button>
        <button onClick={() => { history.push('/corporate-actions') }}>Cancel</button>
        {id && (
          <button onClick={() => deleteCorporateAction()}>Delete</button>
        )}
      </div>
    </div >
  );
}

export default withRouter(CorporateActionForm);
