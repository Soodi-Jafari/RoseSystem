export class Project {
 
  Project()
  {
    this.roles = [];
  }

    id: string;
    pmProjectId: number;
    title: string;
    isTender: boolean;
    isFeasibility: boolean;
    roles: Role[];

  }

  export class Role {
    disciplineId : number;
    positionId : number;
    disciplineName: string;
  }

  