INSERT INTO public.carts(cart_id, user_id)
VALUES 
	('2de39983-9975-4e84-ba34-6296f5cef64a', 'c889be20-5741-447d-9e66-09c8fedc8bcd'), --Tram
	('5c30420c-b07c-4264-915f-6d3bf51e6243', '0e7d3141-a864-4b1a-8835-85e5b999672a'); --Thu

INSERT INTO public.cart_items
	(cart_item_id, product_id, quantity, cart_id)
VALUES 
	('db5bd03c-17aa-40cd-b134-a4cd9dd970ee', '0df85d76-7b04-4307-8047-7f12721cb4b1', '2de39983-9975-4e84-ba34-6296f5cef64a', 3),
	('1f523b30-c177-410d-ae3d-29bbb53ea75d', '65956491-4b4c-4eb0-983d-4df7e91a85fb', '2de39983-9975-4e84-ba34-6296f5cef64a', 3),
	('b3402cad-567a-4bb6-92ba-0e17f1aae6f4', '6d93a38a-7efb-4b74-a32f-6681dbdafff3', '2de39983-9975-4e84-ba34-6296f5cef64a', 3),
	('1efc1a4e-54cb-491d-bfb6-7ebddeaf3b3b', '74f99a6d-75fd-4c5b-a3e8-8f5e7a9c2b1d', '2de39983-9975-4e84-ba34-6296f5cef64a', 3),
	('d0fabff9-cb76-4dff-9359-9a240418cf58', '807273bb-e792-464f-9ecf-77064e0820a9', '2de39983-9975-4e84-ba34-6296f5cef64a', 2);

SELECT cart_id, user_id
	FROM public.carts;

SELECT cart_item_id, product_id, quantity, cart_id
	FROM public.cart_items;

create index index_cart_id on carts(cart_id);
create index index_cart_item_id on cart_items(cart_item_id);

