
import { Suspense } from 'react';
import CourseDetailClient from './CourseDetailClient';

// Mock course data (in a real app, this would come from a database or API)
const coursesData = {
  "zhiroszhiganie1": {
    id: "zhiroszhiganie1",
    title: "Fat Burning I",
    image: "/course1.png",
    price: 3000,
    rating: 5,
    description: "A specialized fat-burning workout program to kickstart weight loss and sculpt a toned physique.",
    details: [
      "4-week program",
      "3–4 workouts per week, 30–45 minutes each",
      "Includes warm-up, main set, and cooldown",
      "No special equipment required"
    ],
    benefits: [
      "Boosts metabolism",
      "Reduces body fat percentage",
      "Improves endurance",
      "Enhances overall body tone"
    ],
    forWhom: "Suitable for beginners and intermediate level. Perfect for those looking to start a fat loss journey and tone their body.",
    includes: [
      "Detailed video guide for each exercise",
      "Workout log to track progress",
      "Nutrition tips for maximum results",
      "Access to a private support chat"
    ],
    trainerInfo: {
      name: "Anastasia Mironova",
      credential: "Certified fitness coach, nutritionist",
      image: "https://ext.same-assets.com/3026737255/1007424658.svg"
    },
    reviews: [
      {
        name: "Elena",
        text: "Great program! Lost 4 kg in a month and noticeably toned up. The workouts are intense but manageable even for beginners.",
        rating: 5
      },
      {
        name: "Marina",
        text: "Loved the format—short and effective workouts. You feel every muscle group being worked. Highly recommend!",
        rating: 5
      },
      {
        name: "Olga",
        text: "I've been doing this for two months and the results are impressive! The nutrition tips included are especially valuable.",
        rating: 5
      }
    ]
  },
  "dlya-zala1": {
    id: "dlya-zala1",
    title: "Gym Workout I",
    image: "/course2.png",
    price: 3000,
    rating: 5,
    description: "A comprehensive gym training program aimed at balanced full-body muscle development.",
    details: [
      "6-week program",
      "3 workouts per week, 60–75 minutes each",
      "Split-training system",
      "Requires standard gym equipment"
    ],
    benefits: [
      "Increases muscle mass",
      "Strengthens all major muscle groups",
      "Improves body proportions",
      "Boosts strength levels"
    ],
    forWhom: "For beginners and intermediates. Great for anyone learning to train at the gym or wanting to improve exercise technique.",
    includes: [
      "3D demonstrations of each exercise",
      "Training planner with progress tracking",
      "Diet and supplement recommendations",
      "Trainer consultation on exercise form"
    ],
    trainerInfo: {
      name: "Alexander Petrov",
      credential: "Powerlifting champion, personal trainer",
      image: "https://ext.same-assets.com/3026737255/2692404718.svg"
    },
    reviews: [
      {
        name: "Dmitry",
        text: "Perfect for gym newbies. Clear instructions and easy-to-follow technique guidance. My fitness improved a lot in 6 weeks.",
        rating: 5
      },
      {
        name: "Igor",
        text: "Structured plan with gradual intensity. The technique tips helped me avoid injuries. Great value!",
        rating: 5
      },
      {
        name: "Anton",
        text: "Been following this for two months. Results exceeded expectations—my lifts nearly doubled!",
        rating: 4
      }
    ]
  },
  "funkcionalnyj-trening": {
    id: "funkcionalnyj-trening",
    title: "Functional 3D II",
    image: "/course3.png",
    price: 4500,
    rating: 5,
    description: "An advanced functional training program for full-spectrum physical development and multi-angle muscle activation.",
    details: [
      "8-week program",
      "4 workouts per week, 45–60 minutes each",
      "Circuit training format",
      "Minimal equipment needed (dumbbells, bands, jump rope)"
    ],
    benefits: [
      "Builds functional strength and power",
      "Improves coordination and balance",
      "Boosts endurance and flexibility",
      "Enhances posture and spatial body awareness"
    ],
    forWhom: "Designed for intermediate to advanced users. Great for those with experience looking to level up their training.",
    includes: [
      "Full video workouts with trainer guidance",
      "Bonus mobility and recovery routines",
      "Load periodization for continuous progress",
      "Personalized workout intensity guidance"
    ],
    trainerInfo: {
      name: "Ekaterina Smirnova",
      credential: "Functional training pro, group class instructor",
      image: "https://ext.same-assets.com/3026737255/29451733.svg"
    },
    reviews: [
      {
        name: "Maria",
        text: "Fantastic program to shake up your routine! The exercises are creative and hit muscles from all angles.",
        rating: 5
      },
      {
        name: "Alexey",
        text: "Not for total beginners, but if you’ve got a base—results are amazing. Big gains in coordination and endurance.",
        rating: 5
      },
      {
        name: "Natalia",
        text: "Second month on this program. Love the variety—it keeps workouts fresh. My body feels stronger and more functional.",
        rating: 5
      }
    ]
  }
};

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  return Object.keys(coursesData).map(id => ({
    id,
  }));
}

interface CoursePageParams {
  params: {
    id: string;
  };
}

export default function CourseDetailPage({ params }: CoursePageParams) {
  const { id } = params;
  const course = coursesData[id as keyof typeof coursesData];

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseDetailClient course={course} />
    </Suspense>
  );
}
