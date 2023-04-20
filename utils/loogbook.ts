import { LogbookMutableData } from '../api/logbookEndpoint';

export const splitReturnTripLoogbookEntry = (
  entry: LogbookMutableData
): { first: LogbookMutableData; second: LogbookMutableData } => {
  const legKilometres = Math.floor(entry.driven_kilometres / 2);
  const evenDrivenKilometres = entry.driven_kilometres % 2 === 0;

  const firstLegEndKilometres = evenDrivenKilometres
    ? entry.start_kilometres + legKilometres
    : entry.start_kilometres + legKilometres + 1;
  const firstLegDrivenKilometres =
    firstLegEndKilometres - entry.start_kilometres;

  const first: LogbookMutableData = {
    vehicle_id: entry.vehicle_id,
    driven_on: entry.driven_on,
    start_kilometres: entry.start_kilometres,
    end_kilometres: firstLegEndKilometres,
    driven_kilometres: firstLegDrivenKilometres,
    litres_refuelled: entry.litres_refuelled,
    origin: entry.origin,
    destination: entry.destination,
    project_id: entry.project_id,
    comment: entry.comment,
  };

  const second: LogbookMutableData = {
    vehicle_id: entry.vehicle_id,
    driven_on: entry.driven_on,
    start_kilometres: firstLegEndKilometres,
    end_kilometres: entry.end_kilometres,
    driven_kilometres: legKilometres,
    litres_refuelled: undefined,
    origin: entry.destination,
    destination: entry.origin,
    project_id: entry.project_id,
    comment: entry.comment,
  };

  return { first: first, second: second };
};
