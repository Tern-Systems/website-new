using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using static System.Net.Mime.MediaTypeNames;

namespace btmc.src.ui.resources.toolbox.CTextBox
{
    public class CustomTextBox : System.Windows.Controls.TextBox
    {
        static CustomTextBox()
        {
            DefaultStyleKeyProperty.OverrideMetadata(typeof(CustomTextBox),
                new FrameworkPropertyMetadata(typeof(CustomTextBox)));
        }

        public CustomTextBox()
        {
            Loaded += OnLoaded;
            GotFocus += OnGotFocus;
            LostFocus += OnLostFocus;
        }

        // CornerRadius DependencyProperty
        public static readonly DependencyProperty CornerRadiusProperty =
            DependencyProperty.Register(nameof(CornerRadius), typeof(CornerRadius),
                typeof(CustomTextBox), new PropertyMetadata(new CornerRadius(0)));

        public CornerRadius CornerRadius
        {
            get => (CornerRadius)GetValue(CornerRadiusProperty);
            set => SetValue(CornerRadiusProperty, value);
        }

        // Placeholder DependencyProperty
        public static readonly DependencyProperty PlaceholderProperty =
            DependencyProperty.Register(nameof(Placeholder), typeof(string),
                typeof(CustomTextBox), new PropertyMetadata(string.Empty, OnPlaceholderChanged));

        public string Placeholder
        {
            get => (string)GetValue(PlaceholderProperty);
            set => SetValue(PlaceholderProperty, value);
        }

        private static void OnPlaceholderChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is CustomTextBox tb)
            {
                tb.ApplyPlaceholder();
            }
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            ApplyPlaceholder();
        }

        private void OnGotFocus(object sender, RoutedEventArgs e)
        {
            if (Text == Placeholder)
            {
                Text = "";
                Foreground = Brushes.White;
            }
        }

        private void OnLostFocus(object sender, RoutedEventArgs e)
        {
            ApplyPlaceholder();
        }

        private void ApplyPlaceholder()
        {
            if (string.IsNullOrWhiteSpace(Text))
            {
                Text = Placeholder;
                Foreground = Brushes.Gray;
            }
        }
    }
}
