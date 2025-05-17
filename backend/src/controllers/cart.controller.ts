import { Request, Response } from 'express';
import { Cart } from '../models/cart.model';
import { IOrder } from '../models/order.model';
import { IUser } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { item } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Vérifier si le panier existe déjà pour cet utilisateur
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Créer un nouveau panier
      cart = new Cart({
        user: userId,
        items: [item]
      });
    } else {
      // Ajouter l'item au panier existant
      const existingItem = cart.items.find((i: any) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push(item);
      }
    }

    if (cart) {
      await cart.save();
    }
    res.status(201).json({ message: 'Article ajouté au panier', cart });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
  try {
    const { item } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    // Vérifier si le panier existe déjà pour cet utilisateur
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Créer un nouveau panier
    }

    await cart.save();
    res.status(201).json({ message: 'Article ajouté au panier', cart });
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
