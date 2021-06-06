import { GuidLookupValue, LookupValue } from 'src/app/models/lookup-value';

export class ProjectPosition
{
    id: number;
    project: GuidLookupValue;
    user: LookupValue;
    position: LookupValue;
    discipline: LookupValue;
}