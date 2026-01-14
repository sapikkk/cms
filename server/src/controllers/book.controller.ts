/**
 * Book Controller
 * Handle book library management
 */

import { Request, Response, NextFunction } from 'express'
import { prisma } from '@config/db'

export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { published } = req.query

    const where: any = {}
    if (published !== undefined) where.isPublished = published === 'true'

    const books = await prisma.book.findMany({
      where,
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: books
    })
  } catch (error) {
    next(error)
  }
}

export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, username: true, fullName: true }
        }
      }
    })

    if (!book) {
      res.status(404).json({
        success: false,
        message: 'Book not found'
      })
      return
    }

    res.json({
      success: true,
      data: book
    })
  } catch (error) {
    next(error)
  }
}

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, summary, coverUrl, contentUrl, price, styleConfig, isPublished } = req.body
    const userId = (req as any).user?.userId

    const book = await prisma.book.create({
      data: {
        title,
        author,
        summary,
        coverUrl,
        contentUrl,
        price: price || 0,
        styleConfig: styleConfig || {},
        isPublished: isPublished || false,
        createdBy: userId
      }
    })

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    })
  } catch (error) {
    next(error)
  }
}

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body

    const book = await prisma.book.update({
      where: { id },
      data: updates
    })

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: book
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    await prisma.book.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Book deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const publishBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const book = await prisma.book.update({
      where: { id },
      data: { isPublished: true }
    })

    res.json({
      success: true,
      message: 'Book published successfully',
      data: book
    })
  } catch (error) {
    next(error)
  }
}

export const unpublishBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const book = await prisma.book.update({
      where: { id },
      data: { isPublished: false }
    })

    res.json({
      success: true,
      message: 'Book unpublished successfully',
      data: book
    })
  } catch (error) {
    next(error)
  }
}
