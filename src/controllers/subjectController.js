import { prisma } from '../db/prismaClient.js'

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany()
    res.json(subjects)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' })
  }
}

export const createSubject = async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  try {
    const newSubject = await prisma.subject.create({ data: { name } })
    res.status(201).json(newSubject)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' })
  }
}

export const updateSubject = async (req, res) => {
  const { id } = req.params
  const { name } = req.body
  try {
    const existing = await prisma.subject.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const updated = await prisma.subject.update({
      where: { id: Number(id) },
      data: { name },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subject' })
  }
}

export const deleteSubject = async (req, res) => {
  const { id } = req.params
  try {
    const existing = await prisma.subject.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    await prisma.subject.delete({ where: { id: Number(id) } })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' })
  }
}
