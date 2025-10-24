export type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};



export const data: Feature[] = [
    {
        id:  1,
        icon: '/todo-icon.svg',
        title: 'Simple & Clean',
        description: 'Beautiful interface that helps you focus on what matters.'
    },
    {
        id: 2,  
        icon: '/zap.svg',
        title: 'Fast & Responsive',
        description: 'Lightning-fast performance across all your devices.'
    },
    {
        id: 3,
        icon: '/circle-check.svg',
        title: 'Stay organized',
        description: 'Keep track of everything with ease and efficiency.'
    }
]