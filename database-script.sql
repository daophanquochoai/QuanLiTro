USE [QLNT]
GO
/****** Object:  Table [dbo].[bill]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[bill](
	[bill_id] [int] IDENTITY(1,1) NOT NULL,
	[begin_date] [date] NOT NULL,
	[electric_number_begin] [int] NOT NULL,
	[electric_number_end] [int] NOT NULL,
	[end_date] [date] NOT NULL,
	[note] [nvarchar](255) NULL,
	[status] [bit] NOT NULL,
	[total] [money] NULL,
	[water_number_begin] [int] NOT NULL,
	[water_number_end] [int] NOT NULL,
	[room_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[bill_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[contract]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contract](
	[contract_id] [int] IDENTITY(1,1) NOT NULL,
	[begin_date] [date] NOT NULL,
	[created_date] [date] NOT NULL,
	[end_date] [date] NOT NULL,
	[status] [bit] NOT NULL,
	[customer_id] [int] NOT NULL,
	[room_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[contract_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[customer]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer](
	[customer_id] [int] IDENTITY(1,1) NOT NULL,
	[date_of_birth] [date] NOT NULL,
	[email] [varchar](255) NOT NULL,
	[first_name] [nvarchar](55) NOT NULL,
	[identifier] [varchar](12) NOT NULL,
	[info_address] [nvarchar](100) NOT NULL,
	[last_name] [nvarchar](55) NOT NULL,
	[phone_number] [varchar](10) NOT NULL,
	[sex] [bit] NOT NULL,
	[user_auth_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[customer_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK_dmp9ohtfi44u95ogi5xrarjgt] UNIQUE NONCLUSTERED 
(
	[identifier] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK_dwk6cx0afu8bs9o4t536v1j5v] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK_rosd2guvs3i1agkplv5n8vu82] UNIQUE NONCLUSTERED 
(
	[phone_number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[electric_price]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[electric_price](
	[electric_price_id] [int] IDENTITY(1,1) NOT NULL,
	[changed_date] [datetime] NULL,
	[price] [money] NULL,
PRIMARY KEY CLUSTERED 
(
	[electric_price_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[history_customer]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[history_customer](
	[history_customer_id] [int] IDENTITY(1,1) NOT NULL,
	[begin_date] [datetime] NOT NULL,
	[end_date] [datetime] NULL,
	[customer_id] [int] NULL,
	[room_new] [int] NULL,
	[room_old] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[history_customer_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[passwork_token]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[passwork_token](
	[email] [varchar](255) NOT NULL,
	[create_time] [datetime2](6) NULL,
	[identify] [char](4) NULL,
	[status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[request]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[request](
	[request_id] [int] IDENTITY(1,1) NOT NULL,
	[created_date] [datetime] NOT NULL,
	[is_send] [bit] NULL,
	[message] [nvarchar](255) NOT NULL,
	[status] [bit] NOT NULL,
	[customer_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[room]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[room](
	[room_id] [int] NOT NULL,
	[limit] [int] NOT NULL,
	[price] [money] NOT NULL,
	[room_type_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[room_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[room_service]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[room_service](
	[room_service_id] [int] IDENTITY(1,1) NOT NULL,
	[begin_date] [date] NULL,
	[end_date] [date] NULL,
	[quantity] [int] NOT NULL,
	[room_id] [int] NULL,
	[service_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[room_service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[room_type]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[room_type](
	[room_type_id] [int] IDENTITY(1,1) NOT NULL,
	[room_type_name] [nvarchar](55) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[room_type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK_lnfd1exxyyo0s1fm5ymidgxaa] UNIQUE NONCLUSTERED 
(
	[room_type_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[service]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[service](
	[service_id] [int] IDENTITY(1,1) NOT NULL,
	[price] [money] NULL,
	[service_name] [nvarchar](55) NULL,
PRIMARY KEY CLUSTERED 
(
	[service_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user_auth]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_auth](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[active] [bit] NOT NULL,
	[password] [varchar](255) NOT NULL,
	[role] [varchar](255) NOT NULL,
	[user_name] [varchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK_khvy62m1hbch5didnccejueun] UNIQUE NONCLUSTERED 
(
	[user_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[water_price]    Script Date: 23/06/24 1:19:22 CH ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[water_price](
	[water_price_id] [int] IDENTITY(1,1) NOT NULL,
	[changed_date] [datetime] NULL,
	[price] [money] NULL,
PRIMARY KEY CLUSTERED 
(
	[water_price_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[contract] ADD  DEFAULT ((0)) FOR [status]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [FKdfcq46u083yahna8q9v1o7bbi] FOREIGN KEY([room_id])
REFERENCES [dbo].[room] ([room_id])
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [FKdfcq46u083yahna8q9v1o7bbi]
GO
ALTER TABLE [dbo].[contract]  WITH CHECK ADD  CONSTRAINT [FK439acep1c8d9xqoi5py8of4yt] FOREIGN KEY([room_id])
REFERENCES [dbo].[room] ([room_id])
GO
ALTER TABLE [dbo].[contract] CHECK CONSTRAINT [FK439acep1c8d9xqoi5py8of4yt]
GO
ALTER TABLE [dbo].[contract]  WITH CHECK ADD  CONSTRAINT [FKq28qogy68douoc4gkgcy3ow9p] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([customer_id])
GO
ALTER TABLE [dbo].[contract] CHECK CONSTRAINT [FKq28qogy68douoc4gkgcy3ow9p]
GO
ALTER TABLE [dbo].[customer]  WITH CHECK ADD  CONSTRAINT [FKgtr2blvpgss9r8spxvg7n406m] FOREIGN KEY([user_auth_id])
REFERENCES [dbo].[user_auth] ([id])
GO
ALTER TABLE [dbo].[customer] CHECK CONSTRAINT [FKgtr2blvpgss9r8spxvg7n406m]
GO
ALTER TABLE [dbo].[history_customer]  WITH CHECK ADD  CONSTRAINT [FKcfv2slrrb0ihdqcrxfx99cb14] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([customer_id])
GO
ALTER TABLE [dbo].[history_customer] CHECK CONSTRAINT [FKcfv2slrrb0ihdqcrxfx99cb14]
GO
ALTER TABLE [dbo].[history_customer]  WITH CHECK ADD  CONSTRAINT [FKgj3m7ittb7dklhd88v3i2kyey] FOREIGN KEY([room_new])
REFERENCES [dbo].[room] ([room_id])
GO
ALTER TABLE [dbo].[history_customer] CHECK CONSTRAINT [FKgj3m7ittb7dklhd88v3i2kyey]
GO
ALTER TABLE [dbo].[history_customer]  WITH CHECK ADD  CONSTRAINT [FKmmdt581rkcyyem3xlcqxdlrma] FOREIGN KEY([room_old])
REFERENCES [dbo].[room] ([room_id])
GO
ALTER TABLE [dbo].[history_customer] CHECK CONSTRAINT [FKmmdt581rkcyyem3xlcqxdlrma]
GO
ALTER TABLE [dbo].[request]  WITH CHECK ADD  CONSTRAINT [FK6wuyy6femh1tl1jxmw1ilrs6b] FOREIGN KEY([customer_id])
REFERENCES [dbo].[customer] ([customer_id])
GO
ALTER TABLE [dbo].[request] CHECK CONSTRAINT [FK6wuyy6femh1tl1jxmw1ilrs6b]
GO
ALTER TABLE [dbo].[room]  WITH CHECK ADD  CONSTRAINT [FKd468eq7j1cbue8mk20qfrj5et] FOREIGN KEY([room_type_id])
REFERENCES [dbo].[room_type] ([room_type_id])
GO
ALTER TABLE [dbo].[room] CHECK CONSTRAINT [FKd468eq7j1cbue8mk20qfrj5et]
GO
ALTER TABLE [dbo].[room_service]  WITH CHECK ADD  CONSTRAINT [FK3jb3uo6oi9pyw63s0ulnlss32] FOREIGN KEY([room_id])
REFERENCES [dbo].[room] ([room_id])
GO
ALTER TABLE [dbo].[room_service] CHECK CONSTRAINT [FK3jb3uo6oi9pyw63s0ulnlss32]
GO
ALTER TABLE [dbo].[room_service]  WITH CHECK ADD  CONSTRAINT [FKn5ff8ekvf2ayw3o35ctksyfyp] FOREIGN KEY([service_id])
REFERENCES [dbo].[service] ([service_id])
GO
ALTER TABLE [dbo].[room_service] CHECK CONSTRAINT [FKn5ff8ekvf2ayw3o35ctksyfyp]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [BILL_check_electric_number_begin] CHECK  (([electric_number_begin]>=(0)))
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [BILL_check_electric_number_begin]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [BILL_check_electric_number_end] CHECK  (([electric_number_end]>=[electric_number_begin] AND [electric_number_end]>=(0)))
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [BILL_check_electric_number_end]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [BILL_check_Ngay] CHECK  (([end_date]>[begin_date]))
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [BILL_check_Ngay]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [BILL_check_total] CHECK  (([total]>=(0)))
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [BILL_check_total]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [BILL_check_water_begin] CHECK  (([water_number_begin]>=(0)))
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [BILL_check_water_begin]
GO
ALTER TABLE [dbo].[bill]  WITH CHECK ADD  CONSTRAINT [BILL_check_water_end] CHECK  (([water_number_end]>=(0) AND [water_number_end]>=[water_number_begin]))
GO
ALTER TABLE [dbo].[bill] CHECK CONSTRAINT [BILL_check_water_end]
GO
ALTER TABLE [dbo].[contract]  WITH CHECK ADD  CONSTRAINT [CONTRACT_check_begin_date] CHECK  (([begin_date]>=[created_date] AND [end_date]>[begin_date]))
GO
ALTER TABLE [dbo].[contract] CHECK CONSTRAINT [CONTRACT_check_begin_date]
GO
ALTER TABLE [dbo].[customer]  WITH CHECK ADD  CONSTRAINT [CUSTOMER_check_date_of_birth] CHECK  (([date_of_birth]<getdate()))
GO
ALTER TABLE [dbo].[customer] CHECK CONSTRAINT [CUSTOMER_check_date_of_birth]
GO
ALTER TABLE [dbo].[electric_price]  WITH CHECK ADD  CONSTRAINT [CK_electric_price] CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[electric_price] CHECK CONSTRAINT [CK_electric_price]
GO
ALTER TABLE [dbo].[history_customer]  WITH CHECK ADD  CONSTRAINT [CK_history_customer] CHECK  ((([end_date]>=[begin_date] OR [end_date] IS NULL) AND [room_new]<>[room_old]))
GO
ALTER TABLE [dbo].[history_customer] CHECK CONSTRAINT [CK_history_customer]
GO
ALTER TABLE [dbo].[room]  WITH CHECK ADD  CONSTRAINT [CK_room] CHECK  (([limit]>=(0) AND [price]>=(0)))
GO
ALTER TABLE [dbo].[room] CHECK CONSTRAINT [CK_room]
GO
ALTER TABLE [dbo].[room_service]  WITH CHECK ADD  CONSTRAINT [CK_room_service] CHECK  (([end_date]>[begin_date] AND [quantity]>=(0)))
GO
ALTER TABLE [dbo].[room_service] CHECK CONSTRAINT [CK_room_service]
GO
ALTER TABLE [dbo].[service]  WITH CHECK ADD  CONSTRAINT [CK_service] CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[service] CHECK CONSTRAINT [CK_service]
GO
ALTER TABLE [dbo].[water_price]  WITH CHECK ADD  CONSTRAINT [CK_water_price] CHECK  (([price]>=(0)))
GO
ALTER TABLE [dbo].[water_price] CHECK CONSTRAINT [CK_water_price]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'bill', @level2type=N'CONSTRAINT',@level2name=N'BILL_check_total'
GO
