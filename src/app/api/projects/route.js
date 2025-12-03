import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Project from '@/models/project.model.js';

const seedProjects = [
    {
        image: { id: "mission-1", description: "Satellite orbiting the earth.", imageUrl: "https://images.unsplash.com/photo-1670850727683-868419a93c04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzcGFjZSUyMHNhdGVsbGl0ZXxlbnwwfHx8fDE3NjQ3NDE0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "space satellite" },
        title: 'Project Nebula',
        slug: 'project-nebula',
        description: 'Developing a decentralized global communication network to connect the unconnected.',
        details: 'Project Nebula aims to solve one of the most pressing challenges of our time: global connectivity. By leveraging a decentralized network of low-orbit satellites, we are building a censorship-resistant and accessible internet for everyone, regardless of their geographical location. Our innovative approach ensures data privacy and security, empowering communities worldwide.',
        tags: ['Connectivity', 'Decentralization'],
        order: 0,
    },
    {
        image: { id: "mission-2", description: "Blueprint of a futuristic city.", imageUrl: "https://images.unsplash.com/photo-1602992907096-953f9373be3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmdXR1cmlzdGljJTIwYXJjaGl0ZWN0dXJlfGVufDB8fHx8MTc2NDY3MDY0MXww&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "futuristic architecture" },
        title: 'Project Terra',
        slug: 'project-terra',
        description: 'Creating sustainable urban ecosystems using AI-driven resource management.',
        details: 'Project Terra is our commitment to a sustainable future. We are developing an advanced AI platform that optimizes resource management in urban environments. From smart grids that reduce energy consumption to intelligent waste management systems, our goal is to create cities that are not only technologically advanced but also environmentally responsible and resilient.',
        tags: ['Sustainability', 'AI', 'Smart Cities'],
        order: 1,
    },
    {
        image: { id: "mission-3", description: "Scientist looking through a microscope.", imageUrl: "https://images.unsplash.com/photo-1630959305606-3123a081dada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxzY2llbnRpZmljJTIwcmVzZWFyY2h8ZW58MHx8fHwxNzY0NzQxNDU2fDA&ixlib=rb-4.1.0&q=80&w=1080", imageHint: "scientific research" },
        title: 'Project Chimera',
        slug: 'project-chimera',
        description: 'Advancing personalized medicine through rapid genomic sequencing and analysis.',
        details: 'Project Chimera is at the forefront of the healthcare revolution. By combining rapid genomic sequencing with powerful machine learning algorithms, we are making personalized medicine a reality. Our platform provides doctors and researchers with the tools to understand individual genetic makeups, leading to more effective, tailored treatments for a wide range of diseases.',
        tags: ['Biotechnology', 'Healthcare'],
        order: 2,
    },
];

export async function GET() {
  try {
    await _db();
    let projects = await Project.find().sort({ order: 1 });
    if (!projects || projects.length === 0) {
      await Project.deleteMany({});
      projects = await Project.insertMany(seedProjects);
    }
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching projects.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of projects.' }, { status: 400 });
        }

        await Project.deleteMany({});
        
        const projectsToInsert = body.map((project, index) => {
            const newProject = { ...project, order: index };
            if (newProject._id && typeof newProject._id === 'string' && newProject._id.startsWith('new_')) {
                delete newProject._id;
            }
            return newProject;
        });

        const newProjects = await Project.insertMany(projectsToInsert);

        return NextResponse.json(newProjects, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating projects.', error: error.message }, { status: 500 });
    }
}
